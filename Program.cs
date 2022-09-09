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

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

await app.Services.GetService<IDataStore>()?.Init();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
