using Npgsql;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.MapGet("/", () => "Sturgeon Excursions");


bool IsDateAvailable(NpgsqlConnection conn, int excursionId, DateTime bookingDate, string timeSlot)
{
    // 1. Check if date is in the past
    if (bookingDate.Date < DateTime.UtcNow.Date)
    {
        return false;
    }

    // 2. Use PostgreSQL function for the rest
    using var cmd = new NpgsqlCommand(@"
        SELECT check_availability(@excursionId, @bookingDate, @timeSlot)", conn);
    cmd.Parameters.AddWithValue("@excursionId", excursionId);
    cmd.Parameters.AddWithValue("@bookingDate", bookingDate.Date);
    cmd.Parameters.AddWithValue("@timeSlot", timeSlot);

    return (bool)cmd.ExecuteScalar()!;
}

app.MapGet("/excursions/{id}/availability", (int id, int days = 90) =>
// return available dates for the next 90 days
// use availableDates view
// line 181 in schema
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT charter_id, charter_name, available_date FROM AvailableDates
        WHERE charter_id = @id AND available_date BETWEEN CURRENT_DATE AND CURRENT_DATE + @days 
        ORDER BY available_date", conn);

    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@days", days);

    using var reader = cmd.ExecuteReader();
    var availableDates = new List<AvailabilityResponse>();
    while (reader.Read())
    {
        availableDates.Add(new AvailabilityResponse(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetDateTime(2)
        ));
    }
    return Results.Ok(availableDates);  
});

// CUSTOMER ENDPOINTS
app.MapGet("/customers", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand("SELECT id, name, phone, email FROM Customers ORDER BY id", conn);
    using var reader = cmd.ExecuteReader();
    var customers = new List<Customer>();
    while (reader.Read())
    {
        customers.Add(new Customer(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetString(3)
        ));
    }
    return Results.Ok(customers);
});

app.MapPost("/customers", ([FromBody] CustomerDto customer) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        INSERT INTO Customers (name, phone, email)
        VALUES (@name, @phone, @email) RETURNING id", conn);
    cmd.Parameters.AddWithValue("name", (object)customer.Name ?? DBNull.Value);
    cmd.Parameters.AddWithValue("phone", (object)customer.Phone ?? DBNull.Value);
    cmd.Parameters.AddWithValue("email", (object)customer.Email ?? DBNull.Value);
    var id = cmd.ExecuteScalar();
    return Results.Ok(new { id, message = "Customer created" });
});

app.MapPut("/customers/{id}", (int id, [FromBody] CustomerDto customer) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        UPDATE Customers SET name = @name, phone = @phone, email = @email
        WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("name", (object)customer.Name ?? DBNull.Value);
    cmd.Parameters.AddWithValue("phone", (object)customer.Phone ?? DBNull.Value);
    cmd.Parameters.AddWithValue("email", (object)customer.Email ?? DBNull.Value);
    cmd.ExecuteNonQuery();
    return Results.Ok("Customer updated");
});

app.MapDelete("/customers/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand("DELETE FROM Customers WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.ExecuteNonQuery();
    return Results.Ok("Customer deleted");
});


// EXCURSION ENDPOINTS
app.MapGet("/excursions", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT id, name, description, duration_hours, base_price, max_capacity, is_active, created_at, updated_at 
        FROM Excursions
        WHERE is_active = true
        ORDER BY id", conn);

    using var reader = cmd.ExecuteReader();
    var excursions = new List<Excursion>();
    while (reader.Read())
    {
        excursions.Add(new Excursion(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetDecimal(3),
            reader.GetDecimal(4),
            reader.GetInt32(5),
            reader.GetBool(6),
            reader.GetDateTime(7),
            reader.GetDateTime(8)
        ));
    }
    return Results.Ok(excursions);
});


app.MapGet("/excursions/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        SELECT id, name, description, duration_hours, base_price, max_capacity, is_active, created_at, updated_at 
        FROM Excursions 
        WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);
    
    using var reader = cmd.ExecuteReader();
    if (reader.Read())
    {
        var excursion = new Excursion(
            reader.GetInt32(0),      // id
            reader.GetString(1),     // name
            reader.GetString(2),     // description
            reader.GetDecimal(3),    // duration_hours
            reader.GetDecimal(4),    // base_price
            reader.GetInt32(5),      // max_capacity
            reader.GetBool(6),       // is_active
            reader.GetDateTime(7),   // created_at
            reader.GetDateTime(8)    // updated_at
        );
        return Results.Ok(excursion);
    }
    return Results.NotFound(new { message = "Excursion not found" });
});

app.Run();

public record InvoiceRequest(int CustomerId, List<int> JobIds);
public record StatusUpdate(string Status);
