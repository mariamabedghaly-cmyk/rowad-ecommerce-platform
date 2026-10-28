const axios = require('axios');

const cartServiceUrl = process.env.CART_SERVICE_URL || 'http://localhost:5004';

const getCartForUser = async (authToken, correlationId) => {
    try {
        const response = await axios.get(`${cartServiceUrl}/api/cart`, {
            timeout: 5000,
            headers: {
                Authorization: authToken,
                'X-Correlation-ID': correlationId || ''
            }
        });
        return response.data;
    } catch (error) {
        console.error(`[Order Service] Error fetching cart: ${error.message}`);
        return null;
    }
};

const clearCartForUser = async (authToken, correlationId) => {
    try {
        await axios.delete(`${cartServiceUrl}/api/cart`, {
            timeout: 5000,
            headers: {
                Authorization: authToken,
                'X-Correlation-ID': correlationId || ''
            }
        });
    } catch (error) {
        console.error(`[Order Service] Error clearing cart: ${error.message}`);
    }
};

module.exports = { getCartForUser, clearCartForUser };
