using Thea.Config;
using Thea.Data;
using Thea.TeaTimer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

using var store = new SQLLiteDataStore();
builder.Services.AddSingleton<IDataStore>(store);

// background timer
builder.Services.AddSingleton<ITeaTimer, ServiceTimer>();

// notifications services
builder.Services.AddTransient<INotifyer, MQTTTimer>();
builder.Services.AddTransient<INotifyer, ConsoleTimer>();
// TODO add more notification type

builder.Services.Configure<MQTTConfig>(builder.Configuration.GetSection("MQTT"));

var app = builder.Build();

await store.Init();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
