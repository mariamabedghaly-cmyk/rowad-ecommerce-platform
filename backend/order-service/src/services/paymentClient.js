const axios = require('axios');

const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5003';

const processPayment = async ({ orderId, userId, amount, currency, paymentMethod }, correlationId) => {
    try {
        const response = await axios.post(`${paymentServiceUrl}/api/payment/process`, {
            orderId,
            userId,
            amount,
            currency: currency || 'EGP',
            paymentMethod: paymentMethod || 'CreditCard'
        }, {
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
                'X-Correlation-ID': correlationId || ''
            }
        });
        return response.data;
    } catch (error) {
        console.error(`[Order Service] Error contacting Payment Service: ${error.message}`);
        return {
            status: 'Declined',
            message: `Payment Service unreachable or error: ${error.message}`
        };
    }
};

module.exports = { processPayment };
