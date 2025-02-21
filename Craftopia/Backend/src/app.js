require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const auctionRoute = require('./routes/auctionRoute');
app.use('/auction', auctionRoute);

const authRoute = require('./routes/authRoute');
app.use('/auth', authRoute);

const customerRoute = require('./routes/customerRoute');
app.use('/customer', customerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;