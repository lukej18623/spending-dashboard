public record AvailabilityResponse(
    int ExcursionId,
    string ExcursionName,
    DateTime AvailableDate,
    bool MorningAvailable,
    bool AfternoonAvailable,
    bool FulldayAvailable
);