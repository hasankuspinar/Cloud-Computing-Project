import React from 'react';

const TodoList = ({ todos, toggleTodo, deleteTodo }) => {
  if (todos.length === 0) {
    return <div className="todo-list">No todos found. Add one above!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <div 
          key={todo.id} 
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button 
            onClick={() => deleteTodo(todo.id)}
            style={{ 
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              color: '#d9534f',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList; 