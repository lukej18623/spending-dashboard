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

app.MapGet("/", () => "Sturgeon Excursions - Booking System API");

// ============================================
// EXCURSION ENDPOINTS
// ============================================

// Get all active excursions
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
            reader.GetBoolean(6),
            reader.GetDateTime(7),
            reader.GetDateTime(8)
        ));
    }
    return Results.Ok(excursions);
});

// Get specific excursion
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
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetDecimal(3),
            reader.GetDecimal(4),
            reader.GetInt32(5),
            reader.GetBoolean(6),
            reader.GetDateTime(7),
            reader.GetDateTime(8)
        );
        return Results.Ok(excursion);
    }
    return Results.NotFound(new { error = "Excursion not found" });
});

// Get availability for a specific excursion
app.MapGet("/excursions/{id}/availability", (int id, int days = 90) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT excursion_id, excursion_name, available_date, morning_available, afternoon_available, fullday_available
        FROM AvailableDates
        WHERE excursion_id = @id AND available_date BETWEEN CURRENT_DATE AND CURRENT_DATE + @days
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
            reader.GetDateTime(2),
            reader.GetBoolean(3),
            reader.GetBoolean(4),
            reader.GetBoolean(5)
        ));
    }
    return Results.Ok(availableDates);
});

// ============================================
// CUSTOMER ENDPOINTS
// ============================================

// Get all customers
app.MapGet("/customers", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand("SELECT id, name, phone, email, created_at FROM Customers ORDER BY id", conn);
    using var reader = cmd.ExecuteReader();
    var customers = new List<Customer>();
    while (reader.Read())
    {
        customers.Add(new Customer(
            reader.GetInt32(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetDateTime(4)
        ));
    }
    return Results.Ok(customers);
});

// Create a new customer
app.MapPost("/customers", ([FromBody] CustomerDto dto) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        INSERT INTO Customers (name, phone, email)
        VALUES (@name, @phone, @email) RETURNING id", conn);
    cmd.Parameters.AddWithValue("name", dto.Name);
    cmd.Parameters.AddWithValue("phone", dto.Phone);
    cmd.Parameters.AddWithValue("email", dto.Email);

    var id = cmd.ExecuteScalar();
    return Results.Ok(new { id, message = "Customer created" });
});

// Update a customer
app.MapPut("/customers/{id}", (int id, [FromBody] CustomerDto dto) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        UPDATE Customers SET name = @name, phone = @phone, email = @email
        WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("name", dto.Name);
    cmd.Parameters.AddWithValue("phone", dto.Phone);
    cmd.Parameters.AddWithValue("email", dto.Email);

    var rowsAffected = cmd.ExecuteNonQuery();
    if (rowsAffected == 0)
    {
        return Results.NotFound(new { error = "Customer not found" });
    }
    return Results.Ok(new { message = "Customer updated" });
});

// Delete a customer
app.MapDelete("/customers/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand("DELETE FROM Customers WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);

    var rowsAffected = cmd.ExecuteNonQuery();
    if (rowsAffected == 0)
    {
        return Results.NotFound(new { error = "Customer not found" });
    }
    return Results.Ok(new { message = "Customer deleted" });
});

// ============================================
// BOOKING ENDPOINTS (With Capacity & Conflict Checking)
// ============================================

// Get all bookings
app.MapGet("/bookings", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT b.id, b.customer_id, c.name as customer_name, b.excursion_id, e.name as excursion_name,
               b.booking_date, b.time_slot, b.num_guests, b.total_price, b.status, b.special_requests, b.created_at
        FROM Bookings b
        JOIN Customers c ON b.customer_id = c.id
        JOIN Excursions e ON b.excursion_id = e.id
        ORDER BY b.booking_date DESC, b.created_at DESC", conn);

    using var reader = cmd.ExecuteReader();
    var bookings = new List<BookingResponse>();
    while (reader.Read())
    {
        bookings.Add(new BookingResponse(
            reader.GetInt32(0),
            reader.GetInt32(1),
            reader.GetString(2),
            reader.GetInt32(3),
            reader.GetString(4),
            reader.GetDateTime(5),
            reader.GetString(6),
            reader.GetInt32(7),
            reader.GetDecimal(8),
            reader.GetString(9),
            reader.IsDBNull(10) ? null : reader.GetString(10),
            reader.GetDateTime(11)
        ));
    }
    return Results.Ok(bookings);
});

// Get specific booking
app.MapGet("/bookings/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT b.id, b.customer_id, c.name as customer_name, b.excursion_id, e.name as excursion_name,
               b.booking_date, b.time_slot, b.num_guests, b.total_price, b.status, b.special_requests, b.created_at
        FROM Bookings b
        JOIN Customers c ON b.customer_id = c.id
        JOIN Excursions e ON b.excursion_id = e.id
        WHERE b.id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    using var reader = cmd.ExecuteReader();
    if (reader.Read())
    {
        var booking = new BookingResponse(
            reader.GetInt32(0),
            reader.GetInt32(1),
            reader.GetString(2),
            reader.GetInt32(3),
            reader.GetString(4),
            reader.GetDateTime(5),
            reader.GetString(6),
            reader.GetInt32(7),
            reader.GetDecimal(8),
            reader.GetString(9),
            reader.IsDBNull(10) ? null : reader.GetString(10),
            reader.GetDateTime(11)
        );
        return Results.Ok(booking);
    }
    return Results.NotFound(new { error = "Booking not found" });
});

// Create a new booking (WITH VALIDATION)
app.MapPost("/bookings", ([FromBody] BookingDto dto) =>
{
    if (!DateTime.TryParse(dto.BookingDate, out var bookingDate))
    {
        return Results.BadRequest(new { error = "Invalid date format. Use YYYY-MM-DD" });
    }

    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    // Step 1: Check if date/time is available (conflict check)
    using var checkCmd = new NpgsqlCommand("SELECT check_availability(@excursionId, @bookingDate, @timeSlot)", conn);
    checkCmd.Parameters.AddWithValue("@excursionId", dto.ExcursionId);
    checkCmd.Parameters.AddWithValue("@bookingDate", bookingDate.Date);
    checkCmd.Parameters.AddWithValue("@timeSlot", dto.TimeSlot);

    var isAvailable = (bool)checkCmd.ExecuteScalar()!;
    if (!isAvailable)
    {
        return Results.BadRequest(new { error = "This date/time is not available. Already booked or date is blocked." });
    }

    // Step 2: Check capacity
    using var capacityCmd = new NpgsqlCommand("SELECT validate_booking_capacity(@excursionId, @numGuests)", conn);
    capacityCmd.Parameters.AddWithValue("@excursionId", dto.ExcursionId);
    capacityCmd.Parameters.AddWithValue("@numGuests", dto.NumGuests);

    var hasCapacity = (bool)capacityCmd.ExecuteScalar()!;
    if (!hasCapacity)
    {
        return Results.BadRequest(new { error = "Number of guests exceeds excursion capacity." });
    }

    // Step 3: Get base price for calculation
    using var priceCmd = new NpgsqlCommand("SELECT base_price FROM Excursions WHERE id = @id", conn);
    priceCmd.Parameters.AddWithValue("@id", dto.ExcursionId);
    var basePrice = (decimal)priceCmd.ExecuteScalar()!;

    // Step 4: Create the booking
    using var insertCmd = new NpgsqlCommand(@"
        INSERT INTO Bookings (customer_id, excursion_id, booking_date, time_slot, num_guests, total_price, special_requests)
        VALUES (@customerId, @excursionId, @bookingDate, @timeSlot, @numGuests, @totalPrice, @specialRequests)
        RETURNING id", conn);
    insertCmd.Parameters.AddWithValue("@customerId", dto.CustomerId);
    insertCmd.Parameters.AddWithValue("@excursionId", dto.ExcursionId);
    insertCmd.Parameters.AddWithValue("@bookingDate", bookingDate.Date);
    insertCmd.Parameters.AddWithValue("@timeSlot", dto.TimeSlot);
    insertCmd.Parameters.AddWithValue("@numGuests", dto.NumGuests);
    insertCmd.Parameters.AddWithValue("@totalPrice", basePrice);
    insertCmd.Parameters.AddWithValue("@specialRequests", (object?)dto.SpecialRequests ?? DBNull.Value);

    var bookingId = insertCmd.ExecuteScalar();
    return Results.Ok(new { id = bookingId, message = "Booking created successfully", totalPrice = basePrice });
});

// Update booking status
app.MapPatch("/bookings/{id}/status", (int id, [FromBody] BookingStatusUpdate update) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        UPDATE Bookings SET status = @status WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@status", update.Status);

    var rowsAffected = cmd.ExecuteNonQuery();
    if (rowsAffected == 0)
    {
        return Results.NotFound(new { error = "Booking not found" });
    }
    return Results.Ok(new { message = "Booking status updated" });
});

// Delete a booking
app.MapDelete("/bookings/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand("DELETE FROM Bookings WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    var rowsAffected = cmd.ExecuteNonQuery();
    if (rowsAffected == 0)
    {
        return Results.NotFound(new { error = "Booking not found" });
    }
    return Results.Ok(new { message = "Booking deleted" });
});

// ============================================
// BLOCKED DATES ENDPOINTS
// ============================================

// Get all blocked dates
app.MapGet("/blocked-dates", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT id, block_date, reason, excursion_id, created_by, created_at
        FROM BlockedDates
        ORDER BY block_date", conn);

    using var reader = cmd.ExecuteReader();
    var blockedDates = new List<BlockedDate>();
    while (reader.Read())
    {
        blockedDates.Add(new BlockedDate(
            reader.GetInt32(0),
            reader.GetDateTime(1),
            reader.GetString(2),
            reader.IsDBNull(3) ? null : reader.GetInt32(3),
            reader.IsDBNull(4) ? null : reader.GetString(4),
            reader.GetDateTime(5)
        ));
    }
    return Results.Ok(blockedDates);
});

// Add a blocked date
app.MapPost("/blocked-dates", ([FromBody] BlockedDateDto dto) =>
{
    if (!DateTime.TryParse(dto.BlockDate, out var blockDate))
    {
        return Results.BadRequest(new { error = "Invalid date format. Use YYYY-MM-DD" });
    }

    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        INSERT INTO BlockedDates (block_date, reason, excursion_id, created_by)
        VALUES (@blockDate, @reason, @excursionId, @createdBy) RETURNING id", conn);
    cmd.Parameters.AddWithValue("@blockDate", blockDate.Date);
    cmd.Parameters.AddWithValue("@reason", dto.Reason);
    cmd.Parameters.AddWithValue("@excursionId", (object?)dto.ExcursionId ?? DBNull.Value);
    cmd.Parameters.AddWithValue("@createdBy", (object?)dto.CreatedBy ?? DBNull.Value);

    var id = cmd.ExecuteScalar();
    return Results.Ok(new { id, message = "Blocked date created" });
});

// Delete a blocked date
app.MapDelete("/blocked-dates/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand("DELETE FROM BlockedDates WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);

    var rowsAffected = cmd.ExecuteNonQuery();
    if (rowsAffected == 0)
    {
        return Results.NotFound(new { error = "Blocked date not found" });
    }
    return Results.Ok(new { message = "Blocked date deleted" });
});

app.Run();

// ============================================
// DTOs and Records
// ============================================

public record Excursion(
    int Id,
    string Name,
    string Description,
    decimal DurationHours,
    decimal BasePrice,
    int MaxCapacity,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record AvailabilityResponse(
    int ExcursionId,
    string ExcursionName,
    DateTime AvailableDate,
    bool MorningAvailable,
    bool AfternoonAvailable,
    bool FulldayAvailable
);

public record Customer(
    int Id,
    string Name,
    string Phone,
    string Email,
    DateTime CreatedAt
);

public record CustomerDto(
    string Name,
    string Phone,
    string Email
);

public record BookingResponse(
    int Id,
    int CustomerId,
    string CustomerName,
    int ExcursionId,
    string ExcursionName,
    DateTime BookingDate,
    string TimeSlot,
    int NumGuests,
    decimal TotalPrice,
    string Status,
    string? SpecialRequests,
    DateTime CreatedAt
);

public record BookingDto(
    int CustomerId,
    int ExcursionId,
    string BookingDate,
    string TimeSlot,
    int NumGuests,
    string? SpecialRequests
);

public record BookingStatusUpdate(
    string Status
);

public record BlockedDate(
    int Id,
    DateTime BlockDate,
    string Reason,
    int? ExcursionId,
    string? CreatedBy,
    DateTime CreatedAt
);

public record BlockedDateDto(
    string BlockDate,
    string Reason,
    int? ExcursionId,
    string? CreatedBy
);