//Persisting Values Without Re-Rendering Using useRef//
import React, { useEffect, useRef } from "react";

function App() {
  const clickCountRef = useRef(0);

  useEffect(() => {
    console.log("Component Mounted");
  }, []);

  const handleClick = () => {
    clickCountRef.current += 1;
    console.log(`Button clicked ${clickCountRef.current} times`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <button onClick={handleClick}>Click me!</button>
    </div>
  );
}

export default App;
