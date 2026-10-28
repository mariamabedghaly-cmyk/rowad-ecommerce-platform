using Microsoft.AspNetCore.Mvc;
using PaymentService.DTOs;
using PaymentService.Services;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentProcessor _paymentProcessor;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPaymentProcessor paymentProcessor, ILogger<PaymentController> logger)
    {
        _paymentProcessor = paymentProcessor;
        _logger = logger;
    }

    /// <summary>
    /// Processes a simulated payment for an order
    /// </summary>
    [HttpPost("process")]
    [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _paymentProcessor.ProcessPaymentAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves simulated payment details for an order
    /// </summary>
    [HttpGet("order/{orderId}")]
    [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByOrderId(string orderId)
    {
        var result = await _paymentProcessor.GetPaymentByOrderIdAsync(orderId);
        if (result == null)
        {
            return NotFound(new { message = $"No payment record found for Order {orderId}" });
        }
        return Ok(result);
    }

    /// <summary>
    /// Retrieves payment record by Transaction ID
    /// </summary>
    [HttpGet("transaction/{transactionId}")]
    [ProducesResponseType(typeof(PaymentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByTransactionId(string transactionId)
    {
        var result = await _paymentProcessor.GetPaymentByTransactionIdAsync(transactionId);
        if (result == null)
        {
            return NotFound(new { message = $"Transaction {transactionId} not found" });
        }
        return Ok(result);
    }
}
