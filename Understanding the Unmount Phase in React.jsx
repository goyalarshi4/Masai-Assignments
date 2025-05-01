//Understanding the Unmount Phase in React//
import React, { useState, useEffect } from "react";

// Component that logs messages on mount and unmount
const MessageComponent = () => {
  useEffect(() => {
    console.log("Component Mounted");

    return () => {
      console.log("Component Unmounted");
    };
  }, []);

  return <h2>Hello! I'm the component.</h2>;
};

// Parent component that toggles visibility
const App = () => {
  const [show, setShow] = useState(true);

  const toggleComponent = () => {
    setShow(prev => !prev);
  };

  return (
    <div>
      <button onClick={toggleComponent}>
        {show ? "Hide" : "Show"} Component
      </button>
      {show && <MessageComponent />}
    </div>
  );
};

export default App;
