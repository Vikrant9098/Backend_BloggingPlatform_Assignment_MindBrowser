const sequelize = require('./config/database');
const User = require('./models/User');
const Post = require('./models/Post');

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: false, alter: true });
    console.log('All models were synchronized successfully.');

    console.log('Database sync completed successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

syncDb();
