using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure port 5003 binding
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5003);
});

// Configure Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration (Isolated DB)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=payments.db";
builder.Services.AddDbContext<PaymentDbContext>(options =>
    options.UseSqlite(connectionString));

// Register domain processor
builder.Services.AddScoped<IPaymentProcessor, MockPaymentProcessor>();

// CORS for cross-service / gateway access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate database schema on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PaymentDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();

// Health check endpoint for container probes
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    service = "payment-service",
    port = 5003
}));

app.MapControllers();

app.Run();
