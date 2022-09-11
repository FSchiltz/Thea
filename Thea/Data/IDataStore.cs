
using Thea.Models;

namespace Thea.Data;

public interface IDataStore
{
    Task<IEnumerable<Tea>> GetTeasAsync(bool disabled);
    Task<Tea?> GetTeaAsync(Guid id);
    Task SaveTeaAsync(Tea tea);

    Task Init();
    Task DeleteTeaAsync(Guid id);
    Task UpdateTeaAsync(Tea tea);
    Task SaveTeaOrderAsync(IEnumerable<(Guid id, int order)> orders);
    Task EnableTeaAsync(Guid id);
    Task DisableTeaAsync(Guid id);
}