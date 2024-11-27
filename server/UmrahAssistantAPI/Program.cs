using Microsoft.EntityFrameworkCore;
using UmrahAssistantAPI.Models;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<UmrahDbContext>(options =>
    options.UseInMemoryDatabase("UmrahAssistantDatabase"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<UmrahDbContext>();
    context.Database.EnsureCreated();
    //Seed the database
    context.Users.Add(new User { Id = Guid.NewGuid().ToString(), Email = "test@example.com", Name = "Test User", Tier = "premium", DailyCalls = 0 });
    context.SaveChanges();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins"); // Add CORS middleware

app.UseAuthorization();

app.MapControllers();

app.Run();
