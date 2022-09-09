using Microsoft.AspNetCore.Mvc;
using Thea.Data;
using Thea.TeaTimer;

namespace Thea.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimerController : ControllerBase
{
    private readonly ILogger<TimerController> _logger;
    private readonly IDataStore _datastore;
    private readonly ITeaTimer _timer;

    public TimerController(IDataStore datastore, ITeaTimer timer, ILogger<TimerController> logger)
    {
        _logger = logger;
        _datastore = datastore;
        _timer = timer;
    }

    [HttpGet]
    public bool Get()
    {
        _logger.LogInformation("Get running timer");

        return _timer.Running();
    }

    [HttpPost("{id}")]
    public async Task<Guid> PostTimer([FromRoute] Guid id)
    {
        // get duration from db
        var tea = await _datastore.GetTeaAsync(id);

        if (tea == null)
            return Guid.Empty;

        // Start background timer
        _logger.LogInformation("Timer started");

        return _timer.Run(tea, tea.Duration);
    }

    [HttpDelete("{id}")]
    public void DeleteTimer([FromRoute] Guid id)
    {
        // Cancel running timer
        _timer.Cancel(id);

        _logger.LogInformation("Timer stopped");
    }
}
