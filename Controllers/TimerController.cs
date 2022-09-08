using Microsoft.AspNetCore.Mvc;
using Thea.Models;

namespace Thea.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimerController : ControllerBase
{
    private readonly ILogger<TimerController> _logger;

    public TimerController(ILogger<TimerController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public bool Get()
    {
        _logger.LogInformation("Get running timer");

        return false;
    }

    [HttpPost("{id}")]
    public Guid PostTimer([FromRoute] Guid id)
    {
        // get duration from db

        // Start background timer
        _logger.LogInformation("Timer started");

        return Guid.NewGuid();
    }

    [HttpDelete("{id}")]
    public void DeleteTimer([FromRoute] Guid id)
    {
        // Cancel running timer

        _logger.LogInformation("Timer stopped");
    }

}
