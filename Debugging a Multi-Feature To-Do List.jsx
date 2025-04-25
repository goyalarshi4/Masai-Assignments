//Debugging a Multi-Feature To-Do List//
import React, { useState } from 'react';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const addTask = () => {
    // Bug fix: Prevent adding empty tasks
    if (!taskName.trim()) {
      alert("Task cannot be empty.");
      return;
    }
    
    setTasks([...tasks, { id: Date.now(), name: taskName, completed: false }]);
    setTaskName('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    // Bug fix: Delete the correct task
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li 
            key={task.id} 
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          >
            <span onClick={() => toggleTaskCompletion(task.id)}>{task.name}</span>
            <button onClick={() => deleteTask(task.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
