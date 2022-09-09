using Thea.Models;

namespace Thea.TeaTimer;

public interface INotifyer
{
    public Task Notify(Tea? sender);
}