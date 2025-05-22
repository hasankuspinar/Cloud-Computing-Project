const express = require('express');
const router = express.Router();
const todos = require('../controllers/todo.controller.js');

// Create a new Todo
router.post('/todos', todos.create);

// Retrieve all Todos
router.get('/todos', todos.findAll);

// Retrieve a single Todo with id
router.get('/todos/:id', todos.findOne);

// Update a Todo with id
router.put('/todos/:id', todos.update);

// Delete a Todo with id
router.delete('/todos/:id', todos.delete);

module.exports = router; 