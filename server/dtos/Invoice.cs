public record Invoice(int Id, int CustomerId, DateTime InvoiceDate, decimal TotalAmount, string Status, string CustomerName, List<Job> Jobs);
