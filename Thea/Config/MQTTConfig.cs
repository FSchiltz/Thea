namespace Thea.Config;

public class MQTTConfig
{
    public int Port { get; set; }
    public string? Host { get; set; }

    public string? Password { get; set; }

    public string? Username { get; set; }

    public string? Topic { get; set; }

    public override string ToString()
    {
        return $"MQTT: {Username}@{Host}:{Port} to {Topic}";
    }
}