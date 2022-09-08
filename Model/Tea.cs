namespace Thea.Models;

public class Tea
{
    public Guid Id { get; }

    public string Name { get; }

    public int Temperature { get; set; }

    public TimeSpan Duration { get; set; }

    public string? Description { get; set; }

    public Tea(Guid id, string name)
    {
        Name = name;
        Id = id;
    }
}