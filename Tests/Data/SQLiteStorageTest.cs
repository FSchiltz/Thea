using Microsoft.Data.Sqlite;
using Thea.Config;
using Thea.Data;

namespace Thea.Tests.Data;

public class SQLiteStorageTests
{
    [Fact]
    public async Task UpdateDB()
    {
        var path = "Test;Mode=Memory;Cache=Shared";
        var config = new StorageConfig
        {
            Path = path,
        };
        var storage = new SQLLiteDataStore(config, null);

        // Keep connection open to have the db stil there for assert
        using var connection = new SqliteConnection("Data Source=" + path);

        await storage.Init();

        // Assert tabel are there
        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = "SELECT name FROM sqlite_master WHERE type='table' AND name='Tea';";

        var reader = await command.ExecuteReaderAsync();

        Assert.True(reader.Read());
    }
}