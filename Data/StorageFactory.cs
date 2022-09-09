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
                return new FileDataStore(config);
            case "SQLLITE":
            case null:
                return new SQLLiteDataStore(config);
            default:
                throw new NotSupportedException();
        }
    }
}