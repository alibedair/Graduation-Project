const sequelize = require('./config/db');
require ('./models/index');
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    require('./app');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();