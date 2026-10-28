using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models;

public class PaymentRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string TransactionId { get; set; } = string.Empty;

    [Required]
    public string OrderId { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public string Currency { get; set; } = "EGP";

    public string PaymentMethod { get; set; } = "CreditCard";

    public string Status { get; set; } = "Approved";

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
