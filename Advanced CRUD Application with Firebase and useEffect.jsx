//Advanced CRUD Application with Firebase and useEffect//
import React, { useState, useEffect } from "react";
import { firestore } from "./firebase-config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Firebase Configuration (firebase-config.js)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// TaskApp Component
const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(firestore, "tasks");
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    };
    fetchTasks();
  }, [tasks]); // Re-fetch tasks after any change

  const addTask = async () => {
    if (newTask) {
      await addDoc(collection(firestore, "tasks"), {
        name: newTask,
        status: "not-started", // Default status
      });
      setNewTask(""); // Clear input
    }
  };

  const updateTaskStatus = async (id, status) => {
    const taskDoc = doc(firestore, "tasks", id);
    await updateDoc(taskDoc, { status });
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(firestore, "tasks", id);
    await deleteDoc(taskDoc);
  };

  const taskCounts = {
    completed: tasks.filter((task) => task.status === "completed").length,
    ongoing: tasks.filter((task) => task.status === "ongoing").length,
    notStarted: tasks.filter((task) => task.status === "not-started").length,
  };

  const filteredTasks = statusFilter === "all" ? tasks : tasks.filter((task) => task.status === statusFilter);

  return (
    <div>
      <Navbar counts={taskCounts} />
      <div style={{ padding: "20px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          style={{ padding: "10px", width: "250px", marginRight: "10px", borderRadius: "5px" }}
        />
        <button onClick={addTask} style={buttonStyle}>Add Task</button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setStatusFilter("all")} style={buttonStyle}>All</button>
        <button onClick={() => setStatusFilter("completed")} style={buttonStyle}>Completed</button>
        <button onClick={() => setStatusFilter("ongoing")} style={buttonStyle}>Ongoing</button>
        <button onClick={() => setStatusFilter("not-started")} style={buttonStyle}>Not Started</button>
      </div>
      <div className="task-list" style={{ padding: "10px" }}>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            updateStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

// TaskCard Component to display each task
const TaskCard = ({ task, updateStatus, deleteTask }) => {
  return (
    <div
      className="task-card"
      onMouseEnter={() => console.log(task.name)} // Hover to show task
      style={{ margin: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", transition: "all 0.3s ease", cursor: "pointer" }}
    >
      <h3>{task.name}</h3>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => updateStatus(task.id, "completed")} style={buttonStyle}>Complete</button>
        <button onClick={() => updateStatus(task.id, "ongoing")} style={buttonStyle}>Ongoing</button>
        <button onClick={() => updateStatus(task.id, "not-started")} style={buttonStyle}>Not Started</button>
        <button onClick={() => deleteTask(task.id)} style={buttonStyle}>Delete</button>
      </div>
    </div>
  );
};

// Navbar Component to display task counts
const Navbar = ({ counts }) => {
  return (
    <div className="navbar" style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#4CAF50", color: "white" }}>
      <div>
        <h3 style={{ margin: 0 }}>Task Management</h3>
      </div>
      <div>
        <div>Completed: {counts.completed}</div>
        <div>Ongoing: {counts.ongoing}</div>
        <div>Not Started: {counts.notStarted}</div>
      </div>
    </div>
  );
};

// Common button style
const buttonStyle = {
  margin: "5px",
  padding: "8px 15px",
  backgroundColor: "#008CBA",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px"
};

export default TaskApp;
