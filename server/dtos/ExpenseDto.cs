// Data object for incoming POST requests
public record ExpenseDto(decimal Amount, string Category, DateTime Date, string Notes);