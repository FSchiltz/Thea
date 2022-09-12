using Thea.Config;
using Thea.Data;
using Thea.Logics.TeaTimer;
using Thea.Logics.Notifications;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.Configure<MQTTConfig>(builder.Configuration.GetSection("MQTT"));
builder.Services.Configure<StorageConfig>(builder.Configuration.GetSection("Storage"));

// background timer
builder.Services.AddSingleton<ITeaTimer, ServiceTimer>();

// notifications services
builder.Services.AddTransient<INotifyer, MQTTNotifyer>();
// TODO add more notification type

builder.Services.AddSingleton<IDataStore>(StorageFactory.Build);

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

// Init the storage backend
var storage = app.Services.GetService<IDataStore>();
if (storage != null)
    await storage.Init();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
