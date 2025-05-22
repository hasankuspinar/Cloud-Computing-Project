const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, '../config.env') });

let sequelize;

// Check for database configuration
if (process.env.DB_DIALECT === 'mysql') {
  // MySQL configuration (works for both local Docker and Cloud SQL)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
       dialectOptions: {
        require: true,
        rejectUnauthorized: false,
       },

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: false,
    }
  );



} else {
  // Fallback to SQLite for development without Docker
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../data/database.sqlite'),
    logging: false,
  });
}

// Define models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.Todo = require('./todo.model')(sequelize, Sequelize);

// Export the db object
module.exports = db; 