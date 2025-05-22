import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import axios from 'axios';

// Configuration
const API_URL = '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch todos on component mount or when filter/search changes
  useEffect(() => {
    fetchTodos();
  }, [filter, searchQuery]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on filters
      let url = `${API_URL}/todos`;
      const params = new URLSearchParams();
      
      if (filter === 'completed') {
        params.append('completed', 'true');
      } else if (filter === 'active') {
        params.append('completed', 'false');
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      // Add params to URL if any exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, { title });
      setTodos([...todos, response.data]);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      });
      
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Todo App</h1>
        <p>A simple application for GCP deployment</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <TodoForm addTodo={addTodo} />
      
      <div className="controls">
        <div className="filter-controls">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="search-controls">
          <input 
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div>Loading todos...</div>
      ) : (
        <TodoList 
          todos={todos} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
        />
      )}
    </div>
  );
}

export default App; 