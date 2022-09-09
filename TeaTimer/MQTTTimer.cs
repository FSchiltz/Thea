using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using Thea.Config;
using Thea.Models;

namespace Thea.TeaTimer;

public class MQTTTimer : INotifyer
{
    private const string DEFAULTTOPIC = "Thea/Tea";
    public MQTTTimer(IServiceProvider services, IOptions<MQTTConfig> config, ILogger<MQTTTimer> logger)
    {
        _logger = logger;
        _config = config.Value;
    }

    private readonly ILogger<MQTTTimer> _logger;
    private readonly MQTTConfig _config;

    public async Task Notify(Tea? sender)
    {
        var mqttFactory = new MqttFactory();

        using (var mqttClient = mqttFactory.CreateMqttClient())
        {
            var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer(_config.Host, _config.Port)
                .WithCredentials(_config.Username, _config.Password)
                .Build();

            await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(_config.Topic ?? DEFAULTTOPIC)
                .WithPayload("Done")
                .Build();

            await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

            _logger.LogInformation("MQTT application message is published to {host}.", _config.Host);
        }
    }
}