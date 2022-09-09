using Microsoft.AspNetCore.Mvc;
using Thea.Data;
using Thea.Models;

namespace Thea.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeaController : ControllerBase
{
    private readonly ILogger<TeaController> _logger;
    private readonly IDataStore _datastore;

    public TeaController(IDataStore datastore, ILogger<TeaController> logger)
    {
        _logger = logger;
        _datastore = datastore;
    }

    [HttpGet]
    public async Task<IEnumerable<Tea>> GetAsync()
    {
        _logger.LogInformation("Get teas");

        return (await _datastore.GetTeasAsync()).OrderByDescending(t => t.Order);
    }

    [HttpPost]
    public async Task PostAsync([FromBody] Tea tea)
    {
        _logger.LogInformation("New tea added");

        if (tea.Id != Guid.Empty)
            await _datastore.UpdateTeaAsync(tea);
        else
            await _datastore.SaveTeaAsync(tea);
    }

    [HttpPost]
    public async Task PostOrderAsync([FromBody] IEnumerable<(Guid id, int order)> orders)
    {
        _logger.LogInformation("Order changed");

        await _datastore.SaveTeaOrderAsync(orders);
    }

    [HttpGet("{id}")]
    public async Task<Tea?> GetTeaAsync([FromRoute] Guid id)
    {
        _logger.LogInformation("Get tea {Id}", id);

        return await _datastore.GetTeaAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task DeleteTeaAsync([FromRoute] Guid id)
    {
        _logger.LogInformation("Delete tea {Id}", id);

        await _datastore.DeleteTeaAsync(id);
    }
}
