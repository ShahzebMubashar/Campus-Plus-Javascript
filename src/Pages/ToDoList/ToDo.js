import React, { useState, useEffect } from "react";
import "./ToDo.css";
import Navbar from "../Index/components/Navbar";

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    text: "",
    completed: false,
    priority: "medium",
    dueDate: "",
    dueTime: "",
  });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/user/my-reminders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setTodos([]);
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      // Get completed task IDs from localStorage
      const completedTaskIds = JSON.parse(localStorage.getItem('completedTaskIds') || '[]');

      if (data)
        setTodos(
          data.map((task) => ({
            id: task.taskid,
            text: task.content,
            // Use either the server status or check if it's in our localStorage completed list
            completed: task.status === true || completedTaskIds.includes(task.taskid),
            priority: task.priority.toLowerCase(),
            dueDate: new Date(task.duedate).toISOString().split("T")[0],
            dueTime: new Date(task.duedate).toTimeString().substring(0, 5),
          }))
        );
      else setTodos([]);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task to backend
  const handleAddNewTask = async (e) => {
    e.preventDefault();
    if (!newTodo.text.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/user/add-reminder", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newTodo.text,
          priority: newTodo.priority,
          duedate: new Date(`${newTodo.dueDate}T${newTodo.dueTime}`),
          status: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      fetchTasks();
      setNewTodo({
        text: "",
        completed: false,
        priority: "medium",
        dueDate: "",
        dueTime: "",
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Toggle task completion
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const newStatus = !todo.completed;

      // Optimistically update UI
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: newStatus } : todo
      );
      setTodos(updatedTodos);

      // Save completed task IDs to localStorage for persistence across pages
      const completedTaskIds = JSON.parse(localStorage.getItem('completedTaskIds') || '[]');
      if (newStatus) {
        // Add to completed tasks if not already in the list
        if (!completedTaskIds.includes(id)) {
          completedTaskIds.push(id);
        }
      } else {
        // Remove from completed tasks
        const index = completedTaskIds.indexOf(id);
        if (index > -1) {
          completedTaskIds.splice(index, 1);
        }
      }
      localStorage.setItem('completedTaskIds', JSON.stringify(completedTaskIds));

      // The endpoint should be for updating status specifically, but it seems the API uses update-priority for both
      const response = await fetch(`http://localhost:4000/user/update-priority/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        // If the API call fails, revert the optimistic update
        setTodos(todos);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Don't fetch tasks again - this is causing the completed status to reset
      // The UI is already updated optimistically above
    } catch (error) {
      console.error("Error toggling task completion:", error.message);
    }
  };

  // Delete task
  const deleteTodo = async (id) => {
    console.log("Task ID:", id);
    try {
      const response = await fetch(
        `http://localhost:4000/user/delete-reminder/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // Update priority
  const updatePriority = async (id, priority) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, priority } : todo
    );

    setTodos(updatedTodos);

    try {
      await fetch(`http://localhost:4000/user/update-priority/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority,
        }),
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Filter and sort todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return todo.priority === filter;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(`${a.dueDate}T${a.dueTime}`);
      const dateB = new Date(`${b.dueDate}T${b.dueTime}`);
      return dateA - dateB;
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
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
              <span className="stat-number">
                {todos.filter((t) => !t.completed).length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {todos.filter((t) => t.completed).length}
              </span>
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

        <form onSubmit={handleAddNewTask} className="todo-form">
          <div className="input-group">
            <input
              type="text"
              value={newTodo.text}
              onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
              placeholder="Add a new task..."
              className="todo-input"
            />
            <input
              type="date"
              value={newTodo.dueDate}
              onChange={(e) =>
                setNewTodo({ ...newTodo, dueDate: e.target.value })
              }
              className="date-input"
            />
            <input
              type="time"
              value={newTodo.dueTime}
              onChange={(e) =>
                setNewTodo({ ...newTodo, dueTime: e.target.value })
              }
              className="time-input"
            />
            <select
              value={newTodo.priority}
              onChange={(e) =>
                setNewTodo({ ...newTodo, priority: e.target.value })
              }
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
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <div
                    className="todo-checkbox"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed ? "✓" : ""}
                  </div>
                  <div className="todo-text">
                    <h3>{todo.text}</h3>
                    <div className="todo-meta">
                      <span className="due-date">
                        <span className="icon">📅</span>
                        {new Date(
                          `${todo.dueDate}T${todo.dueTime}`
                        ).toLocaleString()}
                      </span>
                      <div className="priority-selector">
                        <button
                          className={`priority-btn ${todo.priority === "low" ? "active" : ""
                            }`}
                          onClick={() => updatePriority(todo.id, "low")}
                        >
                          Low
                        </button>
                        <button
                          className={`priority-btn ${todo.priority === "medium" ? "active" : ""
                            }`}
                          onClick={() => updatePriority(todo.id, "medium")}
                        >
                          Medium
                        </button>
                        <button
                          className={`priority-btn ${todo.priority === "high" ? "active" : ""
                            }`}
                          onClick={() => updatePriority(todo.id, "high")}
                        >
                          High
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="no-tasks-message">
              You don't have any tasks yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToDo;
