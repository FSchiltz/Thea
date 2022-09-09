using Thea.Models;

namespace Thea.TeaTimer;

public class MQTTTimer : INotifyer
{
    public MQTTTimer(IServiceProvider services, ILogger<MQTTTimer> logger) 
    {
        _logger = logger;
    }

    private readonly ILogger<MQTTTimer> _logger;

    public void Notify(Tea? sender)
    {
        _logger.LogInformation("Timer MQTT done");
    }
}