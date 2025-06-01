using Npgsql;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Enable Swagger for dev mode, build app 
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

// Configure the HTTP request pipeline
app.UseHttpsRedirection();

// Enable CORS for frontend
app.UseCors("AllowFrontend");

app.MapGet("/", () => "API is running!");

// POST endpoint to create an expense
app.MapPost("/expense", ([FromBody] ExpenseDto expense) =>
{
    using var connection = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    connection.Open();

    using var cmd = new NpgsqlCommand(@"
        INSERT INTO Expenses (amount, category, date, notes)
        VALUES (@amount, @category, @date, @notes)", connection);

    cmd.Parameters.AddWithValue("amount", expense.Amount);
    cmd.Parameters.AddWithValue("category", expense.Category);
    cmd.Parameters.AddWithValue("date", expense.Date);
    cmd.Parameters.AddWithValue("notes", expense.Notes);

    cmd.ExecuteNonQuery();
    return Results.Ok("Expense inserted successfully!");
});


// GET endpoint to read all expenses 
app.MapGet("/expense", () =>
{
    using var connection = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    connection.Open();

    using var cmd = new NpgsqlCommand("SELECT * FROM Expenses", connection);
    using var reader = cmd.ExecuteReader();

    var expenses = new List<Expense>();

    while (reader.Read())
    {
        int id = reader.GetInt32(0);
        decimal amount = reader.GetDecimal(1);
        string category = reader.GetString(2);
        DateTime date = reader.GetDateTime(3);
        string notes = reader.GetString(4);

        expenses.Add(new Expense(id, amount, category, date, notes));
    }
    return Results.Ok(expenses);
});


// DELETE endpoint to delete an expense
app.MapDelete("/expense/{id}", (int id) =>
{
    using var connection = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    connection.Open();

    using var cmd = new NpgsqlCommand("DELETE FROM expenses WHERE id = @id", connection);
    cmd.Parameters.AddWithValue("id", id);

    cmd.ExecuteNonQuery();

    return Results.Ok("Expense deleted successfully.");
});


// PUT endpoint to update and expense
app.MapPut("/expense/{id}", (int id, ExpenseDto updatedExpense) =>
{
    using var connection = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    connection.Open();

    using var cmd = new NpgsqlCommand(@"UPDATE expenses 
                                        SET amount = @amount,
                                            category = @category, 
                                            date = @date,
                                            notes = @notes
                                        WHERE id = @id", connection);

    cmd.Parameters.AddWithValue("id", id);
    cmd.Parameters.AddWithValue("amount", updatedExpense.Amount);
    cmd.Parameters.AddWithValue("category", updatedExpense.Category);
    cmd.Parameters.AddWithValue("date", updatedExpense.Date);
    cmd.Parameters.AddWithValue("notes", updatedExpense.Notes);

    cmd.ExecuteNonQuery();

    return Results.Ok($"Successful update for Id {id}.");
});

app.Run();

