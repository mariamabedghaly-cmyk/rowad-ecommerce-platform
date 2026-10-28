using PaymentService.DTOs;

namespace PaymentService.Services;

public interface IPaymentProcessor
{
    Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto request);
    Task<PaymentResponseDto?> GetPaymentByOrderIdAsync(string orderId);
    Task<PaymentResponseDto?> GetPaymentByTransactionIdAsync(string transactionId);
}
