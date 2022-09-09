using Thea.Models;

namespace Thea.TeaTimer;

public interface ITeaTimer
{
    bool Running();
    Guid Run(Tea tea, TimeSpan duration);
    void Cancel(Guid id);
}