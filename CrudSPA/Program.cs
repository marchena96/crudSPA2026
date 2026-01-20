using CrudSPA.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Servicios (Servicios de Contenedor)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Origen de tu React (Vite)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configuración de la Base de Datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Solo necesitamos controladores para la API
builder.Services.AddControllers();

var app = builder.Build();

// 2. Configuración del Pipeline de solicitudes (Middleware)
// EL ORDEN ES CRÍTICO AQUÍ:

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting(); // 1. Habilita el sistema de rutas

app.UseCors("AllowReactApp"); // 2. Aplica la política de CORS (Justo después de Routing)

app.UseAuthorization(); // 3. Autorización (Después de CORS)

// Mapeo de los controladores de la API
app.MapControllers();

app.Run();