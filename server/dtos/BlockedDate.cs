public record BlockedDate(
    int Id,
    DateTime BlockDate,
    string Reason,
    int? ExcursionId,
    string? CreatedBy,
    DateTime CreatedAt
);
