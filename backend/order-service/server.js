const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = require('./src/app');
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`[Order Service] Running on port ${PORT}`);
});
