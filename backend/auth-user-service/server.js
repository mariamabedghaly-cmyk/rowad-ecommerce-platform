const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = require('./src/app');
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`[Auth & User Service] Running on port ${PORT}`);
});
