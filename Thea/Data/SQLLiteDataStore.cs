using Microsoft.Data.Sqlite;
using Thea.Config;
using Thea.Models;

namespace Thea.Data;

// SQL Lite datastore
public class SQLLiteDataStore : IDataStore, IDisposable
{
    private SqliteConnection? _connection;
    private bool disposedValue;
    private readonly StorageConfig config;
    private readonly ILogger<SQLLiteDataStore>? _logger;
    private readonly string _path;
    private readonly string _pathDb;
    private const string DEFAULTPATH = "storage/db/";
    private const string DEFAULTDB = "tea.db";

    private const string SELECTQUERY = "SELECT id, name, description, duration, temperature, display, disabled, favorite FROM Tea";

    private readonly List<(string name, int version, string sql)> _Migrations = new(){
        ("Init", 1, "CREATE TABLE IF NOT EXISTS Tea (id varchar(30), name varchar(20), description varchar(200), duration varchar(50), temperature int, display int);"),
        ("Field isDisabled", 2, "ALTER TABLE Tea ADD COLUMN disabled INT DEFAULT 0 NOT NULL;"),
        ("Field isFavorite", 3, "ALTER TABLE Tea ADD COLUMN favorite INT DEFAULT 0 NOT NULL;"),
    };

    public SQLLiteDataStore(StorageConfig config, ILogger<SQLLiteDataStore>? logger)
    {
        this.config = config;
        _logger = logger;

        _path = config.Path ?? DEFAULTPATH;

        if (IsMemory(_path))
            _pathDb = _path;
        else
            _pathDb = Path.Combine(_path, DEFAULTDB);
    }

    private bool IsMemory(string path)
    {
        return path.StartsWith(":memory:", StringComparison.OrdinalIgnoreCase)
         || path.Contains(";Mode=Memory", StringComparison.OrdinalIgnoreCase);
    }

    protected SqliteConnection GetConnection() => _connection ??= new SqliteConnection("Data Source=" + _pathDb);

    private Tea ReadTea(SqliteDataReader reader)
    {
        return new Tea(reader.GetGuid(0), reader.GetString(1))
        {
            Description = reader.IsDBNull(2) ? null : reader.GetString(2),
            Duration = reader.IsDBNull(3) ? new TimeSpan() : reader.GetTimeSpan(3),
            Temperature = reader.IsDBNull(4) ? 0 : reader.GetInt32(4),
            Order = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
            IsDisabled = reader.IsDBNull(6) ? false : reader.GetBoolean(6),
            IsFavorite = reader.IsDBNull(7) ? false : reader.GetBoolean(7),
        };
    }

    public async Task Init()
    {
        // create scheme if not memorydb
        if (!IsMemory(_path) && !Directory.Exists(_path))
        {
            Directory.CreateDirectory(_path);
            _logger?.LogInformation("Path created for sql storage: {path}", _path);
        }

        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "CREATE TABLE IF NOT EXISTS Metadata (name varchar(20), value varchar(50), version int);";
        await command.ExecuteNonQueryAsync();

        // get the version
        var version = await GetVersion(connection);

        if (version == 0)
        {
            // create the version field
            var commandMeta = connection.CreateCommand();
            commandMeta.CommandText = "INSERT INTO Metadata VALUES ('Version','Version', 0)";
            await commandMeta.ExecuteNonQueryAsync();
        }

        await ApplyMigration(connection, version);

        _logger?.LogInformation("Init sql lite with {Config}", config);
    }

    private async Task<int> GetVersion(SqliteConnection connection)
    {
        var command = connection.CreateCommand();
        command.CommandText = "SELECT version FROM Metadata WHERE name='Version'";
        var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return reader.GetInt32(0);
        }
        else
            return 0;
    }

    private async Task SetVersion(SqliteConnection connection, int version)
    {
        var command = connection.CreateCommand();
        command.CommandText = $"UPDATE Metadata SET Version={version} WHERE name='Version'";
        await command.ExecuteNonQueryAsync();
    }

    private async Task ApplyMigration(SqliteConnection connection, int version)
    {
        var newVersion = 0;
        foreach (var migration in _Migrations.OrderBy(x => x.version))
        {
            if (migration.version > version)
            {
                var command = connection.CreateCommand();
                command.CommandText = migration.sql;

                await command.ExecuteNonQueryAsync();

                newVersion = Math.Max(newVersion, migration.version);

                await SetVersion(connection, newVersion);
                _logger?.LogInformation($"Migration applied v{migration.version}: " + migration.name);
            }
        }
    }

    public async Task<Tea?> GetTeaAsync(Guid id)
    {
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = SELECTQUERY + " WHERE id=$id;";
        command.Parameters.AddWithValue("$id", id);

        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return ReadTea(reader);
        }

        return null;
    }

    public async Task<IEnumerable<Tea>> GetTeasAsync(bool disabled)
    {
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = $"{SELECTQUERY} {(!disabled ? "WHERE disabled != 1" : "")};";

        using var reader = await command.ExecuteReaderAsync();

        var teas = new List<Tea>();
        while (await reader.ReadAsync())
        {
            teas.Add(ReadTea(reader));
        }

        return teas;
    }

    public async Task SaveTeaAsync(Tea tea)
    {
        using var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "INSERT INTO Tea (id, name, description, duration, temperature) VALUES ($id, $name, $desc, $duration, $temp);";

        var id = Guid.NewGuid();

        command.Parameters.AddWithValue("$id", id);
        command.Parameters.AddWithValue("$name", tea.Name);
        command.Parameters.AddWithValue("$desc", tea.Description ?? "");
        command.Parameters.AddWithValue("$temp", tea.Temperature);
        command.Parameters.AddWithValue("$duration", tea.Duration);

        await command.ExecuteNonQueryAsync();
    }

    public Task DisableTeaAsync(Guid id)
    {
        return UpdateMetadate(id, "disabled", "1");
    }

    public Task EnableTeaAsync(Guid id)
    {
        return UpdateMetadate(id, "disabled", "0");
    }

    public async Task DeleteTeaAsync(Guid id)
    {
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM Tea WHERE id=$id;";
        command.Parameters.AddWithValue("$id", id);

        await command.ExecuteNonQueryAsync();
    }

    public async Task UpdateTeaAsync(Tea tea)
    {
        using var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "UPDATE Tea SET name=$name, description=$desc, duration=$duration, temperature=$temp WHERE id=$id;";

        command.Parameters.AddWithValue("$id", tea.Id);
        command.Parameters.AddWithValue("$name", tea.Name);
        command.Parameters.AddWithValue("$desc", tea.Description ?? "");
        command.Parameters.AddWithValue("$temp", tea.Temperature);
        command.Parameters.AddWithValue("$duration", tea.Duration);

        await command.ExecuteNonQueryAsync();
    }

    public async Task SaveTeaOrderAsync(IEnumerable<(Guid id, int order)> orders)
    {
        using var connection = GetConnection();

        await connection.OpenAsync();

        foreach (var order in orders)
        {
            var command = connection.CreateCommand();
            command.CommandText = "UPDATE Tea SET display=$display WHERE id=$id;";

            command.Parameters.AddWithValue("$id", order.id);
            command.Parameters.AddWithValue("$display", order.order);

            await command.ExecuteNonQueryAsync();
        }
    }

    public Task DeleteFavoriteTeaAsync(Guid id)
    {
        return UpdateMetadate(id, "favorite", "0");
    }

    public Task AddFavoriteTeaAsync(Guid id)
    {
        return UpdateMetadate(id, "favorite", "1");
    }

    private async Task UpdateMetadate(Guid id, string field, string value)
    {
        using var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = $"UPDATE Tea SET {field}={value}  WHERE id=$id;";

        command.Parameters.AddWithValue("$id", id);

        await command.ExecuteNonQueryAsync();
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!disposedValue)
        {
            if (disposing)
            {
                // TODO: dispose managed state (managed objects)
            }

            if (_connection != null)
                _connection.Dispose();

            disposedValue = true;
        }
    }

    // override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    ~SQLLiteDataStore()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: false);
    }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}