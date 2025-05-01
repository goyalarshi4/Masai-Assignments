//Tracking State Changes with useEffect//
import React, { useState, useEffect } from "react";

function App() {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log(`State updated: ${number}`);
  }, [number]);

  const updateNumber = () => {
    const random = Math.floor(Math.random() * 100);
    setNumber(random);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Current Number: {number}</h1>
      <button onClick={updateNumber}>Generate Random Number</button>
    </div>
  );
}

export default App;
