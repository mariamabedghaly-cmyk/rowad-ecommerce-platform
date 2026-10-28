using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.DTOs;
using PaymentService.Models;

namespace PaymentService.Services;

public class MockPaymentProcessor : IPaymentProcessor
{
    private readonly PaymentDbContext _dbContext;
    private readonly IConfiguration _config;
    private readonly ILogger<MockPaymentProcessor> _logger;

    public MockPaymentProcessor(PaymentDbContext dbContext, IConfiguration config, ILogger<MockPaymentProcessor> logger)
    {
        _dbContext = dbContext;
        _config = config;
        _logger = logger;
    }

    public async Task<PaymentResponseDto> ProcessPaymentAsync(PaymentRequestDto request)
    {
        var threshold = _config.GetValue<decimal>("PaymentGateway:AutoApproveThreshold", 10000m);
        var isApproved = request.Amount <= threshold;
        var transactionId = $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

        var status = isApproved ? "Approved" : "Declined";
        var message = isApproved 
            ? "Simulated payment successfully processed and captured."
            : $"Simulated payment declined: Amount exceeds auto-approval ceiling of {threshold} {request.Currency}.";

        var paymentRecord = new PaymentRecord
        {
            TransactionId = transactionId,
            OrderId = request.OrderId,
            UserId = request.UserId,
            Amount = request.Amount,
            Currency = request.Currency,
            PaymentMethod = request.PaymentMethod,
            Status = status,
            Notes = message,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Payments.Add(paymentRecord);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Processed mock payment for Order {OrderId}. Status: {Status}, TxnId: {TxnId}",
            request.OrderId, status, transactionId);

        return new PaymentResponseDto
        {
            TransactionId = transactionId,
            OrderId = request.OrderId,
            Amount = request.Amount,
            Currency = request.Currency,
            Status = status,
            Message = message,
            ProcessedAt = paymentRecord.CreatedAt
        };
    }

    public async Task<PaymentResponseDto?> GetPaymentByOrderIdAsync(string orderId)
    {
        var record = await _dbContext.Payments
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync(p => p.OrderId == orderId);

        if (record == null) return null;

        return new PaymentResponseDto
        {
            TransactionId = record.TransactionId,
            OrderId = record.OrderId,
            Amount = record.Amount,
            Currency = record.Currency,
            Status = record.Status,
            Message = record.Notes ?? string.Empty,
            ProcessedAt = record.CreatedAt
        };
    }

    public async Task<PaymentResponseDto?> GetPaymentByTransactionIdAsync(string transactionId)
    {
        var record = await _dbContext.Payments
            .FirstOrDefaultAsync(p => p.TransactionId == transactionId);

        if (record == null) return null;

        return new PaymentResponseDto
        {
            TransactionId = record.TransactionId,
            OrderId = record.OrderId,
            Amount = record.Amount,
            Currency = record.Currency,
            Status = record.Status,
            Message = record.Notes ?? string.Empty,
            ProcessedAt = record.CreatedAt
        };
    }
}
