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
