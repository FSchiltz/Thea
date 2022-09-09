using System.Timers;
using Thea.Models;

namespace Thea.TeaTimer;

public class ServiceTimer : ITeaTimer
{
    public ServiceTimer(IServiceProvider services)
    {
        Services = services;
    }

    public IServiceProvider Services { get; }

    private readonly Dictionary<Guid, List<System.Timers.Timer>> _timers = new();

    public void Cancel(Guid id)
    {
        if (_timers.TryGetValue(id, out var timers))
        {
            foreach (var timer in timers)
            {
                timer.Stop();
            }
        }
    }

    public Guid Run(Tea tea, TimeSpan duration)
    {
        if (duration.TotalMilliseconds <= 0)
            return Guid.Empty;

        var timer = new System.Timers.Timer(duration.TotalMilliseconds)
        {
            AutoReset = false,
        };
        timer.Elapsed += Notify;

        timer.Start();

        if (_timers.TryGetValue(tea.Id, out var timers))
        {
            timers.Add(timer);
        }
        else
        {
            _timers.Add(tea.Id, new List<System.Timers.Timer> { timer });
        }

        return tea.Id;
    }

    private void Notify(object? sender, ElapsedEventArgs e)
    {
        var notifications = Services.GetServices<INotifyer>();
        foreach (var notification in notifications)
        {
            notification.Notify(null);
        }
    }

    public bool Running()
    {
        return _timers.Any(t => t.Value.Any(x => x.Enabled));
    }
}