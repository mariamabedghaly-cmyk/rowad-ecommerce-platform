using System.ComponentModel.DataAnnotations;

namespace PaymentService.DTOs;

public class PaymentRequestDto
{
    [Required]
    public string OrderId { get; set; } = string.Empty;

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Range(0.01, 1000000.0, ErrorMessage = "Amount must be greater than zero.")]
    public decimal Amount { get; set; }

    [Required]
    public string Currency { get; set; } = "EGP";

    public string PaymentMethod { get; set; } = "CreditCard"; // "CreditCard", "Wallet", "CashOnDelivery"

    public string? CardNumberMasked { get; set; }
}
