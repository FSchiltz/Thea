using Microsoft.AspNetCore.Mvc;
using Thea.Models;

namespace Thea.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeaController : ControllerBase
{
    private readonly ILogger<TeaController> _logger;

    public TeaController(ILogger<TeaController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<Tea> Get()
    {
        _logger.LogInformation("Get teas");

        return Enumerable.Range(1, 5).Select(index => new Tea(Guid.NewGuid(), "Test")
        {
            Duration = new TimeSpan(0, 0, 26),
            Description = "Test description",
            Temperature = 100,
        })
        .ToArray();
    }

    [HttpPost]
    public void Post([FromBody] Tea tea)
    {
        _logger.LogInformation("New tea added");
    }

    [HttpGet("{id}")]
    public Tea GetTea([FromRoute] Guid id)
    {
        return new Tea(id, "Test")
        {
            Duration = new TimeSpan(0, 1, 23),
            Description = "Test description",
            Temperature = 100,
        };
    }
}
