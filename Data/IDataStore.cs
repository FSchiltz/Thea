
using Thea.Models;

namespace Thea.Data;

public interface IDataStore
{
    Task<IEnumerable<Tea>> GetTeasAsync();
    Task<Tea?> GetTeaAsync(Guid id);
    Task SaveTeaAsync(Tea tea);

    Task Init();
    Task DeleteTeaAsync(Guid id);
    Task UpdateTeaAsync(Tea tea);
}