const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config.env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = require('./models');

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is up and running' });
});

// Todo API routes
const todoRoutes = require('./routes/todo.routes');
app.use('/api', todoRoutes);

// Sync database and start server
db.sequelize.sync()
  .then(() => {
    console.log('Database synced');
    
    // If in development mode, add some initial data
    if (process.env.NODE_ENV === 'development') {
      const Todo = db.Todo;
      // Only add initial data if the table is empty
      Todo.count().then(count => {
        if (count === 0) {
          const initialData = [
            { title: 'Learn Kubernetes', completed: false },
            { title: 'Set up GCP project', completed: false },
            { title: 'Deploy containerized workloads', completed: false }
          ];
          
          Promise.all(initialData.map(todo => Todo.create(todo)))
            .then(() => console.log('Initial data added'))
            .catch(err => console.error('Error adding initial data:', err));
        }
      });
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  }); 