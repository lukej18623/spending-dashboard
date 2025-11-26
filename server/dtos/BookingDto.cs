public record BookingDto(
    int CustomerId,
    int ExcursionId,
    string BookingDate,
    string TimeSlot,
    int NumGuests,
    string? SpecialRequests
);
