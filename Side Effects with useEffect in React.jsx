//Side Effects with useEffect in React//
import React, { useState, useEffect } from "react";

function App() {
  const [joke, setJoke] = useState(null);

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await response.json();
      setJoke(data);
    } catch (error) {
      console.error("Error fetching joke:", error);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Random Joke Generator</h1>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "400px",
          margin: "auto",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {joke ? (
          <>
            <h3>{joke.setup}</h3>
            <p>{joke.punchline}</p>
          </>
        ) : (
          <p>Loading joke...</p>
        )}
      </div>
      <button
        onClick={fetchJoke}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Get Another Joke
      </button>
    </div>
  );
}

export default App;
