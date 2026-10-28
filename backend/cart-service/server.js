const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = require('./src/app');
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`[Cart Service] Running on port ${PORT}`);
});
