public record Customer(
    int Id, 
    string Name, 
    string Phone, 
    string Email, 
    DateTime created_at, 
    int total_bookings, 
    bool is_first_timer
);
