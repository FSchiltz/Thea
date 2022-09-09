using Microsoft.Data.Sqlite;
using Thea.Models;

namespace Thea.Data;

// SQL Lite datastore
public class SQLLiteDataStore : IDataStore, IDisposable
{
    private SqliteConnection? _connection;
    private bool disposedValue;

    protected SqliteConnection GetConnection() => _connection ??= new SqliteConnection("Data Source=tea.db");

    private Tea ReadTea(SqliteDataReader reader)
    {
        return new Tea(reader.GetGuid(0), reader.GetString(1))
        {
            Description = reader.GetString(2),
            Duration = reader.GetTimeSpan(3),
            Temperature = reader.GetInt32(4),
        };
    }

    public async Task Init()
    {
        // create scheme
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "CREATE TABLE IF NOT EXISTS Tea (id varchar(30), name varchar(20), description varchar(200), duration varchar(50), temperature int);";

        await command.ExecuteNonQueryAsync();
    }

    public async Task<Tea?> GetTeaAsync(Guid id)
    {
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "SELECT id, name, description, duration, temperature FROM Tea WHERE id=$id;";
        command.Parameters.AddWithValue("$id", id);

        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return ReadTea(reader);
        }

        return null;
    }

    public async Task<IEnumerable<Tea>> GetTeasAsync()
    {
        var connection = GetConnection();

        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "SELECT id, name, description, duration, temperature FROM Tea;";

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
        command.CommandText = "UPDATE Tea SET id=$id, name=$name, description=$desc, duration=$duration, temperature=$temp) WHERE id=$id;";

        command.Parameters.AddWithValue("$id", tea.Id);
        command.Parameters.AddWithValue("$name", tea.Name);
        command.Parameters.AddWithValue("$desc", tea.Description ?? "");
        command.Parameters.AddWithValue("$temp", tea.Temperature);
        command.Parameters.AddWithValue("$duration", tea.Duration);

        await command.ExecuteNonQueryAsync();
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