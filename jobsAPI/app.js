require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect');
const express = require('express');
const app = express();

const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

// middlewares
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.static('./public'));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));




// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middlewares/auth');
app.get('/', (req, res) => {
    res.send('jobs api');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

// error middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3500;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`APP listen on port: ${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();
