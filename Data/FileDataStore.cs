using System.Text.Json;
using Thea.Config;
using Thea.Models;

namespace Thea.Data;

public class FileDataStore : IDataStore
{
    private readonly StorageConfig config;
    private readonly string _path;
    private readonly string _teaPath;
    private const string DEFAULTPATH = "storage/files/";
    private const string TEAPATH = "teas/";
    private const string TEAFILENAME = "tea_";

    public FileDataStore(StorageConfig config)
    {
        this.config = config;
        _path = config.Path ?? DEFAULTPATH;
        _teaPath = Path.Combine(_path, TEAPATH);
    }

    public Task DeleteTeaAsync(Guid id)
    {
        var fileName = Path.Combine(_teaPath, $"{TEAFILENAME}{id}.json");
        File.Delete(fileName);
        return Task.CompletedTask;
    }

    public async Task<Tea?> GetTeaAsync(Guid id)
    {
        var fileName = Path.Combine(_teaPath, $"{TEAFILENAME}{id}.json");

        if (File.Exists(fileName))
        {
            using var stream = File.OpenRead(fileName);
            var tea = await JsonSerializer.DeserializeAsync<Tea>(stream);
            await stream.DisposeAsync();

            return tea;
        }
        else return null;
    }

    public async Task<IEnumerable<Tea>> GetTeasAsync()
    {
        var teas = new List<Tea>();

        foreach (var file in Directory.EnumerateFiles(_teaPath, TEAFILENAME + "*.json"))
        {
            //  a  tea json file
            using var text = File.OpenRead(file);
            try
            {
                var tea = await JsonSerializer.DeserializeAsync<Tea>(text);
                if (tea != null && tea.Id != Guid.Empty)
                {
                    teas.Add(tea);
                }
            }
            catch (JsonException e)
            {
                // TODO log
            }
            await text.DisposeAsync();
        }

        return teas;
    }

    public Task Init()
    {
        if (!Directory.Exists(_teaPath))
            Directory.CreateDirectory(_teaPath);

        return Task.CompletedTask;
    }

    public async Task SaveTeaAsync(Tea tea)
    {
        var id = Guid.NewGuid();
        tea = new Tea(id, tea.Name)
        {
            Description = tea.Description,
            Duration = tea.Duration,
            Order = tea.Order,
            Temperature = tea.Temperature,
        };
        var fileName = Path.Combine(_teaPath, $"{TEAFILENAME}{id}.json");
        using var stream = File.Create(fileName);
        await JsonSerializer.SerializeAsync(stream, tea);
        await stream.DisposeAsync();
    }

    public Task SaveTeaOrderAsync(IEnumerable<(Guid id, int order)> orders)
    {
        throw new NotImplementedException();
    }

    public async Task UpdateTeaAsync(Tea tea)
    {
        var fileName = Path.Combine(_teaPath, $"{TEAFILENAME}{tea.Id}.json");
        using var stream = File.Create(fileName);
        await JsonSerializer.SerializeAsync(stream, tea);
        await stream.DisposeAsync();
    }
}