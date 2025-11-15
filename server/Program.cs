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

app.MapGet("/", () => "Service Business Management API");

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

// JOB ENDPOINTS
app.MapGet("/jobs", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand("SELECT * FROM Jobs ORDER BY date DESC", conn);
    using var reader = cmd.ExecuteReader();
    var jobs = new List<Job>();
    while (reader.Read())
    {
        jobs.Add(new Job(
            reader.GetInt32(0),
            reader.GetInt32(1),
            reader.GetString(2),
            reader.GetString(3),
            reader.GetDateTime(4),
            reader.GetString(5),
            reader.GetDecimal(6)
        ));
    }
    return Results.Ok(jobs);
});

app.MapPost("/jobs", ([FromBody] JobDto job) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        INSERT INTO Jobs (customer_id, service_type, description, date, status, price)
        VALUES (@customer_id, @service_type, @description, @date, @status, @price) RETURNING id", conn);
    cmd.Parameters.AddWithValue("customer_id", job.CustomerId);
    cmd.Parameters.AddWithValue("service_type", (object)job.ServiceType ?? DBNull.Value);
    cmd.Parameters.AddWithValue("description", (object)job.Description ?? DBNull.Value);
    cmd.Parameters.AddWithValue("date", job.Date);
    cmd.Parameters.AddWithValue("status", (object)job.Status ?? DBNull.Value);
    cmd.Parameters.AddWithValue("price", job.Price);
    var id = cmd.ExecuteScalar();
    return Results.Ok(new { id, message = "Job created" });
});

app.MapPut("/jobs/{id}", (int id, [FromBody] JobDto job) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        UPDATE Jobs SET customer_id = @customer_id, service_type = @service_type,
        description = @description, date = @date, status = @status, price = @price
        WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("customer_id", job.CustomerId);
    cmd.Parameters.AddWithValue("service_type", job.ServiceType);
    cmd.Parameters.AddWithValue("description", job.Description);
    cmd.Parameters.AddWithValue("date", job.Date);
    cmd.Parameters.AddWithValue("status", job.Status);
    cmd.Parameters.AddWithValue("price", job.Price);
    cmd.ExecuteNonQuery();
    return Results.Ok("Job updated");
});

app.MapDelete("/jobs/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand("DELETE FROM Jobs WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.ExecuteNonQuery();
    return Results.Ok("Job deleted");
});

// INVOICE ENDPOINTS
app.MapGet("/invoices", () =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand(@"
        SELECT i.id, i.customer_id, i.invoice_date, i.total_amount, i.status, c.name
        FROM Invoices i JOIN Customers c ON i.customer_id = c.id
        ORDER BY i.invoice_date DESC", conn);
    using var reader = cmd.ExecuteReader();
    var invoices = new List<Invoice>();
    while (reader.Read())
    {
        invoices.Add(new Invoice(
            reader.GetInt32(0),
            reader.GetInt32(1),
            reader.GetDateTime(2),
            reader.GetDecimal(3),
            reader.GetString(4),
            reader.GetString(5),
            new List<Job>()
        ));
    }
    return Results.Ok(invoices);
});

app.MapGet("/invoices/{id}", (int id) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();

    using var cmd = new NpgsqlCommand(@"
        SELECT i.id, i.customer_id, i.invoice_date, i.total_amount, i.status, c.name
        FROM Invoices i JOIN Customers c ON i.customer_id = c.id
        WHERE i.id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    using var reader = cmd.ExecuteReader();

    if (!reader.Read())
        return Results.NotFound();

    var invoice = new Invoice(
        reader.GetInt32(0),
        reader.GetInt32(1),
        reader.GetDateTime(2),
        reader.GetDecimal(3),
        reader.GetString(4),
        reader.GetString(5),
        new List<Job>()
    );
    reader.Close();

    using var jobCmd = new NpgsqlCommand(@"
        SELECT j.id, j.customer_id, j.service_type, j.description, j.date, j.status, j.price
        FROM Jobs j JOIN InvoiceJobs ij ON j.id = ij.job_id
        WHERE ij.invoice_id = @invoice_id", conn);
    jobCmd.Parameters.AddWithValue("invoice_id", id);
    using var jobReader = jobCmd.ExecuteReader();

    var jobs = new List<Job>();
    while (jobReader.Read())
    {
        jobs.Add(new Job(
            jobReader.GetInt32(0),
            jobReader.GetInt32(1),
            jobReader.GetString(2),
            jobReader.GetString(3),
            jobReader.GetDateTime(4),
            jobReader.GetString(5),
            jobReader.GetDecimal(6)
        ));
    }

    return Results.Ok(new Invoice(invoice.Id, invoice.CustomerId, invoice.InvoiceDate,
        invoice.TotalAmount, invoice.Status, invoice.CustomerName, jobs));
});

app.MapPost("/invoices", ([FromBody] InvoiceRequest req) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var transaction = conn.BeginTransaction();

    try
    {
        decimal total = 0;
        foreach (var jobId in req.JobIds)
        {
            using var priceCmd = new NpgsqlCommand("SELECT price FROM Jobs WHERE id = @id", conn);
            priceCmd.Parameters.AddWithValue("id", jobId);
            var price = priceCmd.ExecuteScalar();
            if (price != null) total += (decimal)price;
        }

        using var cmd = new NpgsqlCommand(@"
            INSERT INTO Invoices (customer_id, invoice_date, total_amount, status)
            VALUES (@customer_id, @invoice_date, @total_amount, @status) RETURNING id", conn);
        cmd.Parameters.AddWithValue("customer_id", req.CustomerId);
        cmd.Parameters.AddWithValue("invoice_date", DateTime.Now);
        cmd.Parameters.AddWithValue("total_amount", total);
        cmd.Parameters.AddWithValue("status", "Pending");
        var invoiceId = (int)cmd.ExecuteScalar();

        foreach (var jobId in req.JobIds)
        {
            using var linkCmd = new NpgsqlCommand(@"
                INSERT INTO InvoiceJobs (invoice_id, job_id) VALUES (@invoice_id, @job_id)", conn);
            linkCmd.Parameters.AddWithValue("invoice_id", invoiceId);
            linkCmd.Parameters.AddWithValue("job_id", jobId);
            linkCmd.ExecuteNonQuery();
        }

        transaction.Commit();
        return Results.Ok(new { id = invoiceId, total, message = "Invoice created" });
    }
    catch
    {
        transaction.Rollback();
        throw;
    }
});

app.MapPut("/invoices/{id}/status", (int id, [FromBody] StatusUpdate update) =>
{
    using var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    using var cmd = new NpgsqlCommand("UPDATE Invoices SET status = @status WHERE id = @id", conn);
    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("status", update.Status);
    cmd.ExecuteNonQuery();
    return Results.Ok("Invoice status updated");
});

app.Run();

public record InvoiceRequest(int CustomerId, List<int> JobIds);
public record StatusUpdate(string Status);
