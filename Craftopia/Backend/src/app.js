require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true           
}));



app.use(express.json({ limit: '2mb' }));

// Routes
const authRoute = require('./routes/authRoute');
app.use('/auth', authRoute); 

const customerRoute = require('./routes/customerRoute');
app.use('/customer', customerRoute);

const artistRoute = require('./routes/artistRoute');
app.use('/artist', artistRoute);

const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

const productRoute = require('./routes/productRoute');
app.use('/product', productRoute);

const categoryRoute = require('./routes/categoryRoute');
app.use('/category', categoryRoute);

const customizableOptionRoute = require('./routes/customizableOptionRoute');
app.use('/customizableOption', customizableOptionRoute);

const customizationRequestRoute = require('./routes/customizationRequestRoute');
app.use('/customizationRequest', customizationRequestRoute);

const customizationResponseRoute = require('./routes/customizationResponseRoute');
app.use('/customizationResponse', customizationResponseRoute);

const auctionRoute = require('./routes/auctionRoute');
app.use('/auction', auctionRoute);

const auctionRequestRoute = require('./routes/auctionRequestRoute');
app.use('/auctionRequest', auctionRequestRoute);

const bidRoute = require('./routes/bidRoute');
app.use('/bid', bidRoute);

const wishlistRoute = require('./routes/WishlistRoute');
app.use('/wishlist', wishlistRoute);

const orderRoute = require('./routes/orderRoute');
app.use('/order', orderRoute);

const reviewRoute = require('./routes/reviewRoute');
app.use('/review', reviewRoute);

const ratingRoute = require('./routes/ratingRoute');
app.use('/rating', ratingRoute);

const msg = require('./routes/messageRoute');
app.use('/msg', msg);

const paymentRoute = require('./routes/paymentRoute');
app.use('/payment', paymentRoute);

const trackRoute = require('./routes/trackRoute');
app.use('/trackSales', trackRoute);

const reportRoute = require('./routes/reportRoute');
app.use('/report', reportRoute);

const { startAuctionScheduler } = require('./services/auctionScheduler');
startAuctionScheduler();

const cartRoute = require('./routes/cartRoute');
app.use('/mycart', cartRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;