// State Management with useEffect for a Counter Application//
import React, { useState, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log(`Counter value updated: ${counter}`);
  }, [counter]);

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);
  const reset = () => setCounter(0);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Counter Application</h1>
      <h2>{counter}</h2>
      <div>
        <button onClick={increment} style={buttonStyle}>Increment</button>
        <button onClick={decrement} style={buttonStyle}>Decrement</button>
        <button onClick={reset} style={buttonStyle}>Reset</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default App;
