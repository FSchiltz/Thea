using NSubstitute;
using Thea.Controllers;
using Thea.Data;

namespace Thea.Tests.Controllers;

public class TeaTests
{
    [Fact]
    public void CreateNoLogger()
    {
        var storage = Substitute.For<IDataStore>();
        var controller = new TeaController(storage, default);
        Assert.NotNull(controller);
    }

    [Fact]
    public async Task GetTeas()
    {
        var storage = Substitute.For<IDataStore>();
        storage.GetTeasAsync(false).ReturnsForAnyArgs(new List<Models.Tea> {
            new Models.Tea(Guid.NewGuid(), "")
        });
        var controller = new TeaController(storage, default);

        var tea = await controller.GetAsync(false);

        Assert.NotEmpty(tea);
    }

    [Fact]
    public async Task GetTea()
    {
        var storage = Substitute.For<IDataStore>();
        storage.GetTeaAsync(Guid.Empty).ReturnsForAnyArgs(new Models.Tea(Guid.NewGuid(), ""));
        var controller = new TeaController(storage, default);

        var tea = await controller.GetTeaAsync(Guid.NewGuid());

        Assert.NotNull(tea);
        Assert.NotEqual(Guid.Empty, tea!.Id);
    }

    [Fact]
    public async Task GetTeaNoId()
    {
        var storage = Substitute.For<IDataStore>();
        var controller = new TeaController(storage, default);

        var tea = await controller.GetTeaAsync(Guid.Empty);

        Assert.Null(tea);
    }

    [Fact]
    public async Task UpdateTea()
    {
        var tea = new Models.Tea(Guid.NewGuid(), "Test");

        var storage = Substitute.For<IDataStore>();
        var controller = new TeaController(storage, default);

        await controller.PostAsync(tea);

        await storage.Received().UpdateTeaAsync(tea);
    }

    [Fact]
    public async Task SaveTea()
    {
        var tea = new Models.Tea(Guid.Empty, "Test");

        var storage = Substitute.For<IDataStore>();
        var controller = new TeaController(storage, default);

        await controller.PostAsync(tea);

        await storage.Received().SaveTeaAsync(tea);
    }
}