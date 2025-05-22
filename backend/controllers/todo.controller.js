const db = require('../models');
const Todo = db.Todo;
const { Op } = require('sequelize');

// Create and Save a new Todo
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Create a Todo
  const todo = {
    title: req.body.title,
    completed: req.body.completed || false
  };

  try {
    // Save Todo in the database
    const data = await Todo.create(todo);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message || 'Some error occurred while creating the Todo.'
    });
  }
};

// Retrieve all Todos from the database with optional filtering
exports.findAll = async (req, res) => {
  try {
    const { completed, search } = req.query;
    let condition = {};
    
    // Filter by completion status if specified
    if (completed !== undefined) {
      condition.completed = completed === 'true';
    }
    
    // Search by title if specified
    if (search) {
      condition.title = {
        [Op.like]: `%${search}%`
      };
    }
    
    const data = await Todo.findAll({ where: condition });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message || 'Some error occurred while retrieving todos.'
    });
  }
};

// Find a single Todo with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Todo.findByPk(id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message || 'Error retrieving Todo with id=' + id
    });
  }
};

// Update a Todo by the id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update todo properties if they exist in the request
    if (req.body.title !== undefined) {
      todo.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message || 'Error updating Todo with id=' + id
    });
  }
};

// Delete a Todo with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();
    res.json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message || 'Could not delete Todo with id=' + id
    });
  }
}; 