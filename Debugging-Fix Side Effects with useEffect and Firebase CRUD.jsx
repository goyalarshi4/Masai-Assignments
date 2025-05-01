// Debugging: Fix Side Effects with useEffect and Firebase CRUD//
import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config'; // Assume correct config here.

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Define the fetch function to retrieve tasks
    const fetchTasks = async () => {
      const snapshot = await firestore.collection('tasks').get();
      setTasks(snapshot.docs.map(doc => doc.data()));
    };

    // Set up real-time listener for Firestore updates
    const unsubscribe = firestore
      .collection('tasks')
      .onSnapshot(snapshot => {
        setTasks(snapshot.docs.map(doc => doc.data()));
      });

    // Fetch initial tasks when component mounts
    fetchTasks();

    // Cleanup listener on unmount to avoid memory leaks
    return () => unsubscribe();
  }, []); // Empty dependency array to ensure this only runs once on mount

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
