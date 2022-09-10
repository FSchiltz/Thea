using Microsoft.Extensions.Options;
using Thea.Config;

namespace Thea.Data;

public static class StorageFactory
{
    public static IDataStore Build(IServiceProvider services)
    {
        var config = (services.GetService<IOptions<StorageConfig>>())?.Value ?? new StorageConfig();

        switch (config.Type?.ToUpper())
        {
            case "FILE":
                return new FileDataStore(config, services.GetService<ILogger<FileDataStore>>());
            case "SQLLITE":
            case null:
            case "":
                return new SQLLiteDataStore(config, services.GetService<ILogger<SQLLiteDataStore>>());
            default:
                throw new NotSupportedException();
        }
    }
}