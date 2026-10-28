const axios = require('axios');

const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';

const getProductById = async (productId, correlationId) => {
    try {
        const response = await axios.get(`${productServiceUrl}/api/products/${productId}`, {
            timeout: 5000,
            headers: { 'X-Correlation-ID': correlationId || '' }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) return null;
        console.error(`[Order Service] Error contacting Product Service: ${error.message}`);
        throw new Error(`Product Service unavailable: ${error.message}`);
    }
};

module.exports = { getProductById };
