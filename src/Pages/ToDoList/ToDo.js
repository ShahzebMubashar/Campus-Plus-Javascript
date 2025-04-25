//make me an extremely modern and elegant to do list app

import React, { useState } from 'react';
import './ToDo.css';
import Navbar from '../Index/components/Navbar';

function ToDo() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Complete Database Assignment', completed: false, priority: 'high', dueDate: '2024-03-15' },
        { id: 2, text: 'Study for Algorithms Quiz', completed: false, priority: 'medium', dueDate: '2024-03-18' },
        { id: 3, text: 'Submit Software Engineering Project', completed: true, priority: 'high', dueDate: '2024-03-20' }
    ]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: newTodo,
                completed: false,
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0]
            }]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updatePriority = (id, priority) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, priority } : todo
        ));
    };

    return (
        <div className="todo-app">
            <Navbar />
            <div className="todo-container">
                <div className="todo-header">
                    <h1>📝 My Tasks</h1>
                    <div className="todo-stats">
                        <div className="stat-item">
                            <span className="stat-number">{todos.length}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{todos.filter(t => !t.completed).length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{todos.filter(t => t.completed).length}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={addTodo} className="todo-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new task..."
                            className="todo-input"
                        />
                        <button type="submit" className="add-button">
                            <span className="add-icon">+</span>
                            Add Task
                        </button>
                    </div>
                </form>

                <div className="todo-list">
                    {todos.map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-content">
                                <div className="todo-checkbox" onClick={() => toggleTodo(todo.id)}>
                                    {todo.completed ? '✓' : ''}
                                </div>
                                <div className="todo-text">
                                    <h3>{todo.text}</h3>
                                    <div className="todo-meta">
                                        <span className="due-date">
                                            <span className="icon">📅</span>
                                            {new Date(todo.dueDate).toLocaleDateString()}
                                        </span>
                                        <div className="priority-selector">
                                            <button
                                                className={`priority-btn ${todo.priority === 'low' ? 'active' : ''}`}
                                                onClick={() => updatePriority(todo.id, 'low')}
                                            >
                                                Low
                                            </button>
                                            <button
                                                className={`priority-btn ${todo.priority === 'medium' ? 'active' : ''}`}
                                                onClick={() => updatePriority(todo.id, 'medium')}
                                            >
                                                Medium
                                            </button>
                                            <button
                                                className={`priority-btn ${todo.priority === 'high' ? 'active' : ''}`}
                                                onClick={() => updatePriority(todo.id, 'high')}
                                            >
                                                High
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ToDo;
