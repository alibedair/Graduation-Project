const sequelize = require('../config/db');

// Import models
const User = require('./user');
const Artist = require('./artist');
const Customer = require('./customer');
const Admin = require('./admin');
const Product = require('./product');
const Order = require('./order');
const Product_Order = require('./Product_Order');
const Category = require('./category');
const Report = require('./report');
const ReportHandling = require('./reportHandling');
const CustomizableOption = require('./customizableOption');
const OptionValue = require('./optionValue');
const Review = require('./Review');
const Wishlist = require('./wishlist');
const CustomizationRequest = require('./customizationRequest');
const CustomizationResponse = require('./customizationResponse');
const ArtistFollow = require('./artistFollow');
const payment = require('./payment');
const AuctionRequest = require('./auctionRequest');
const categoryRequests = require('./categoriesRequests');

// User-Related Associations
User.hasOne(Admin, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Artist, { foreignKey: 'userId' });
Artist.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Customer, { foreignKey: 'userId' });
Customer.belongsTo(User, { foreignKey: 'userId' });

// Artist & Product Relationship
Artist.hasMany(Product, { foreignKey: 'artistId' });
Product.belongsTo(Artist, { foreignKey: 'artistId' });

// Category & Product Relationship
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

// Order & Customer Relationship
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

// Many-to-Many Order & Product Relationship (Through Product_Order)
Order.belongsToMany(Product, { through: Product_Order, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: Product_Order, foreignKey: 'productId' });


// report & customer Relationship
Report.belongsTo(Customer, { foreignKey: 'ReporterID' });
Customer.hasMany(Report, { foreignKey: 'ReporterID' });

// report & artist Relationship
Report.belongsTo(Artist, { foreignKey: 'ReportedID' });
Artist.hasMany(Report, { foreignKey: 'ReportedID' });


// Many-to-Many report & admin Relationship (Through ReportHandling)
Report.belongsToMany(Admin, { through: ReportHandling, foreignKey: 'reportId' });
Admin.belongsToMany(Report, { through: ReportHandling, foreignKey: 'adminId' });


// Product & CustomizableOption Relationship
Product.hasMany(CustomizableOption, { foreignKey: 'productId' });
CustomizableOption.belongsTo(Product, { foreignKey: 'productId' });

// CustomizableOption & OptionValue Relationship
CustomizableOption.hasMany(OptionValue, { foreignKey: 'optionId' });
OptionValue.belongsTo(CustomizableOption, { foreignKey: 'optionId' });

// Product & Review Relationship
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// Customer & Review Relationship
Customer.hasMany(Review, { foreignKey: 'customerId' });
Review.belongsTo(Customer, { foreignKey: 'customerId' });

// Customer & Wishlist Relationship
Customer.hasMany(Wishlist, { foreignKey: 'customerId' });
Wishlist.belongsTo(Customer, { foreignKey: 'customerId' });

// Product & Wishlist Relationship
Product.hasMany(Wishlist, { foreignKey: 'productId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

// Customer & CustomizationRequest Relationship
Customer.hasMany(CustomizationRequest, { foreignKey: 'customerId' });
CustomizationRequest.belongsTo(Customer, { foreignKey: 'customerId' });

//artist & CustomizationResponse Relationship
Artist.hasMany(CustomizationResponse, { foreignKey: 'artistId' });
CustomizationResponse.belongsTo(Artist, { foreignKey: 'artistId' });


// CustomizationRequest & CustomizationResponse Relationship
CustomizationRequest.hasMany(CustomizationResponse, { foreignKey: 'requestId' });
CustomizationResponse.belongsTo(CustomizationRequest, { foreignKey: 'requestId' });

// Many-to-Many Artist & Customer Relationship (Through ArtistFollow)
Artist.belongsToMany(Customer, { through: ArtistFollow, foreignKey: 'artistId' });
Customer.belongsToMany(Artist, { through: ArtistFollow, foreignKey: 'customerId' });

// Direct associations for ArtistFollow
Artist.hasMany(ArtistFollow, { foreignKey: 'artistId' });
ArtistFollow.belongsTo(Artist, { foreignKey: 'artistId' });

Customer.hasMany(ArtistFollow, { foreignKey: 'customerId' });
ArtistFollow.belongsTo(Customer, { foreignKey: 'customerId' });

// payment & order Relationship
Order.hasOne(payment, { foreignKey: 'orderId' });
payment.belongsTo(Order, { foreignKey: 'orderId' });

//customer & payment Relationship
Customer.hasMany(payment, { foreignKey: 'customerId' });
payment.belongsTo(Customer, { foreignKey: 'customerId' });

// Auction Request associations
Artist.hasMany(AuctionRequest, { foreignKey: 'artistId' });
AuctionRequest.belongsTo(Artist, { foreignKey: 'artistId' });

Product.hasMany(AuctionRequest, { foreignKey: 'productId' });
AuctionRequest.belongsTo(Product, { foreignKey: 'productId' });

// Category Requests associations
Artist.hasMany(categoryRequests, { foreignKey: 'artistId' });
categoryRequests.belongsTo(Artist, { foreignKey: 'artistId' });

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Artist,
  Customer,
  Admin,
  Product,
  Category,
  Order,
  Product_Order,
  Report,
  ReportHandling,
  CustomizableOption,
  OptionValue,
  Review,
  Wishlist,
  CustomizationRequest,
  CustomizationResponse,
  ArtistFollow,  payment,
  AuctionRequest,
  categoryRequests
};