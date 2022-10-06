using Microsoft.AspNetCore.Mvc;
using Thea.Data;
using Thea.Models;

namespace Thea.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeaController : ControllerBase
{
    private readonly ILogger<TeaController>? _logger;
    private readonly IDataStore _datastore;

    public TeaController(IDataStore datastore, ILogger<TeaController>? logger)
    {
        _logger = logger;
        _datastore = datastore;
    }

    [HttpGet]
    public async Task<IEnumerable<Tea>> GetAsync([FromQuery] bool disabled)
    {
        _logger?.LogInformation("Get teas");

        return (await _datastore.GetTeasAsync(disabled)).OrderByDescending(t => t.IsFavorite).ThenBy(t => t.Name);
    }

    [HttpPost]
    public async Task PostAsync([FromBody] Tea tea)
    {
        _logger?.LogInformation("New tea added");

        if (tea.Id != Guid.Empty)
            await _datastore.UpdateTeaAsync(tea);
        else
            await _datastore.SaveTeaAsync(tea);
    }

    [HttpPost("import")]
    public async Task ImportAsync([FromBody] Tea[] teas)
    {
        _logger?.LogInformation("New teas imported");

        foreach (var tea in teas)
            if (tea.Id != Guid.Empty)
                await _datastore.UpdateTeaAsync(tea);
            else
                await _datastore.SaveTeaAsync(tea);
    }

    [HttpPost("Order")]
    public async Task PostOrderAsync([FromBody] IEnumerable<(Guid id, int order)> orders)
    {
        _logger?.LogInformation("Order changed");

        await _datastore.SaveTeaOrderAsync(orders);
    }

    [HttpPost("{id}/Disable")]
    public async Task DisableTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Tea disabled");

        await _datastore.DisableTeaAsync(id);
    }

    [HttpPost("{id}/Enable")]
    public async Task EnableTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Tea disabled");

        await _datastore.EnableTeaAsync(id);
    }

    [HttpDelete("{id}/Favorite")]
    public async Task RemoveFavoriteTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Tea removed from favorite");

        await _datastore.DeleteFavoriteTeaAsync(id);
    }

    [HttpPost("{id}/Favorite")]
    public async Task DeleteFavoriteTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Tea added to favorite");

        await _datastore.AddFavoriteTeaAsync(id);
    }

    [HttpGet("{id}")]
    public async Task<Tea?> GetTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Get tea {Id}", id);

        return await _datastore.GetTeaAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task DeleteTeaAsync([FromRoute] Guid id)
    {
        _logger?.LogInformation("Delete tea {Id}", id);

        await _datastore.DeleteTeaAsync(id);
    }
}
