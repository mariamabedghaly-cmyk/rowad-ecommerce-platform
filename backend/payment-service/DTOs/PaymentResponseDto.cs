namespace PaymentService.DTOs;

public class PaymentResponseDto
{
    public string TransactionId { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "Approved", "Declined", "Pending"
    public string Message { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; }
}
