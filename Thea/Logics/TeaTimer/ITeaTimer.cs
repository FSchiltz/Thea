using Thea.Models;

namespace Thea.Logics.TeaTimer;

public interface ITeaTimer
{
    bool Running();
    Guid Run(Tea tea, TimeSpan duration);
    void Cancel(Guid id);
}