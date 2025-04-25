//Debugging Axios Integration//
import React, { useEffect, useState } from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const fetchData = () => {
    axios("https://your-firebase-db.firebaseio.com/tasks.json")
      .then((response) => {
        const data = response.data;
        if (data) {
          const transformed = Object.entries(data).map(([id, task]) => ({
            id,
            ...task,
          }));
          setTasks(transformed);
        } else {
          setTasks([]);
        }
        setError(""); // clear any old error
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
