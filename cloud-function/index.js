const { Sequelize, Op } = require('sequelize');
const functions = require('@google-cloud/functions-framework');

functions.http('cleanupCompletedTodos', async (req, res) => {

  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    pool: {
      max: 1,
      min: 0,
      idle: 10000
    }
  });

  const Todo = sequelize.define("todo", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    tableName: 'todos', 
    timestamps: false
  });
  try {
    await sequelize.authenticate();

    const deletedCount = await Todo.destroy({
      where: { completed: true }
    });

    console.log(`✅ Cleaned up ${deletedCount} completed todos`);
    res.status(200).send(`Cleaned up ${deletedCount} completed todos`);
  } catch (error) {
    console.error('❌ Error cleaning up todos:', error);
    res.status(500).send('Error cleaning up todos');
  } finally {
    await sequelize.close();
  }
});
