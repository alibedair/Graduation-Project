require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

app.use(helmet());

// Rate limiting - adjust for better performance
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for better performance
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(apiLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, 
  message: 'Too many login attempts, please try again later'
});


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '2mb' }));

// Routes
const auctionRoute = require('./routes/auctionRoute');
app.use('/auction', auctionRoute);

const authRoute = require('./routes/authRoute');
app.use('/auth', authLimiter, authRoute); 

const customerRoute = require('./routes/customerRoute');
app.use('/customer', customerRoute);

const artistRoute = require('./routes/artistRoute');
app.use('/artist', artistRoute);

const productRoute = require('./routes/productRoute');
app.use('/product', productRoute);

const categoryRoute = require('./routes/categoryRoute');
app.use('/category', categoryRoute);

const customizationRequestRoute = require('./routes/customizationRequestRoute');
app.use('/customizationRequest', customizationRequestRoute);

const customizationResponseRoute = require('./routes/customizationResponseRoute');
app.use('/customizationResponse', customizationResponseRoute);

// Add 404 and error handling middleware at the end
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;