using Thea.Models;

namespace Thea.TeaTimer;

public interface INotifyer
{
    public void Notify(Tea? sender);
}