using Thea.Models;

namespace Thea.TeaTimer;

public class ConsoleTimer : INotifyer
{
    public ConsoleTimer(ILogger<ConsoleTimer> logger)
    {
        _logger = logger;
    }

    private readonly ILogger<ConsoleTimer> _logger;

    public Task Notify(Tea? sender)
    {
        _logger.LogInformation("Timer done");
        return Task.CompletedTask;
    }
}