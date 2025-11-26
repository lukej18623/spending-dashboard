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
