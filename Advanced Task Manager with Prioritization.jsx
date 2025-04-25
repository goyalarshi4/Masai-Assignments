//Advanced Task Manager with Prioritization
//
import React, { useState } from 'react';

function TaskManager() {
  // States for tasks, filters, and new task inputs
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('High');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCompletion, setFilterCompletion] = useState('All');

  const addTask = () => {
    if (!title.trim()) {
      alert('Task title cannot be empty!');
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      priority,
      completed: false
    };

    // Add new task and sort by priority
    const newTasks = [...tasks, newTask];
    newTasks.sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setTasks(newTasks);
    setTitle('');
    setPriority('High');
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      filterPriority === 'All' || task.priority === filterPriority;
    const matchesCompletion =
      filterCompletion === 'All' ||
      (filterCompletion === 'Completed' && task.completed) ||
      (filterCompletion === 'Incomplete' && !task.completed);

    return matchesPriority && matchesCompletion;
  });

  return (
    <div>
      <h1>Advanced Task Manager</h1>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div>
        <h3>Filters</h3>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterCompletion}
          onChange={(e) => setFilterCompletion(e.target.value)}
        >
          <option value="All">All Tasks</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              backgroundColor: task.priority === 'High' ? 'red' : 'transparent',
              color: task.priority === 'High' ? 'white' : 'black',
            }}
          >
            <span onClick={() => toggleTaskCompletion(task.id)}>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
