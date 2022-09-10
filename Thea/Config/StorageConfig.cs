namespace Thea.Config;

public class StorageConfig
{
    public string? Type { get; set; }

    public string? Path { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public override string ToString()
    {
        return $"Storage {Type}: {Username}@{Path}";
    }
}