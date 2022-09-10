using Thea.Models;

namespace Thea.Logics.Notifications;

public interface INotifyer
{
    public Task Notify(Tea? sender);
}