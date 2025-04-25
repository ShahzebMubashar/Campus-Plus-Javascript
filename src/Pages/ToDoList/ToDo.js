//make me an extremely modern and elegant to do list app

import React, { useState } from 'react';
import './ToDo.css';
import Navbar from '../Index/components/Navbar';

function ToDo() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Complete Database Assignment', completed: false, priority: 'high', dueDate: '2024-03-15', dueTime: '14:00' },
        { id: 2, text: 'Study for Algorithms Quiz', completed: false, priority: 'medium', dueDate: '2024-03-18', dueTime: '10:00' },
        { id: 3, text: 'Submit Software Engineering Project', completed: true, priority: 'high', dueDate: '2024-03-20', dueTime: '23:59' }
    ]);
    const [newTodo, setNewTodo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('medium');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const addTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: newTodo,
                completed: false,
                priority: priority,
                dueDate: dueDate || new Date().toISOString().split('T')[0],
                dueTime: dueTime || '23:59'
            }]);
            setNewTodo('');
            setDueDate('');
            setDueTime('');
            setPriority('medium');
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

    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'completed') return todo.completed;
        if (filter === 'pending') return !todo.completed;
        if (filter === 'high') return todo.priority === 'high';
        if (filter === 'medium') return todo.priority === 'medium';
        if (filter === 'low') return todo.priority === 'low';
        return true;
    });

    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === 'date') {
            const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
            const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
            return dateA - dateB;
        }
        if (sortBy === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
    });

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

                <div className="filters-section">
                    <div className="filter-group">
                        <label>Filter:</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Tasks</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Sort By:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date">Due Date</option>
                            <option value="priority">Priority</option>
                        </select>
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
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="date-input"
                        />
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="time-input"
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="priority-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button type="submit" className="add-button">
                            <span className="add-icon">+</span>
                            Add Task
                        </button>
                    </div>
                </form>

                <div className="todo-list">
                    {sortedTodos.map(todo => (
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
                                            {new Date(`${todo.dueDate}T${todo.dueTime}`).toLocaleString()}
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
