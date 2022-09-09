using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using Thea.Config;
using Thea.Models;

namespace Thea.Logics.Notifications;

public class MQTTNotifyer : INotifyer
{
    private const string DEFAULTTOPIC = "Thea/Tea";
    public MQTTNotifyer(IServiceProvider services, IOptions<MQTTConfig> config, ILogger<MQTTNotifyer> logger)
    {
        _logger = logger;
        _config = config.Value;
        _logger.LogInformation("Using MQTT with {config}", config.Value);
    }

    private readonly ILogger<MQTTNotifyer> _logger;
    private readonly MQTTConfig _config;

    public async Task Notify(Tea? sender)
    {
        var mqttFactory = new MqttFactory();

        using var mqttClient = mqttFactory.CreateMqttClient();

        var mqttClientOptions = new MqttClientOptionsBuilder()
            .WithTcpServer(_config.Host, _config.Port)
            .WithCredentials(_config.Username, _config.Password)
            .Build();

        var result = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
        if (result == null || result.ResultCode != 0)
            _logger.LogError("MQTT connection error: {code}", result?.ResultCode);

        else
        {
            _logger.LogInformation("Connected to mqtt");
            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(_config.Topic ?? DEFAULTTOPIC)
                .WithPayload("Done")
                .Build();

            await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);

            _logger.LogInformation("MQTT application message is published to {host}.", _config.Host);
        }
    }
}