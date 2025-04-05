const sequelize = require('./config/db');
require('./models/index');

// Add graceful shutdown handling
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  process.exit(0);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Only use alter:true in development
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? {} 
      : { alter: true };
      
    await sequelize.sync(syncOptions);
    console.log('All models were synchronized successfully.');
    
    const app = require('./app');
    
    // Add unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();