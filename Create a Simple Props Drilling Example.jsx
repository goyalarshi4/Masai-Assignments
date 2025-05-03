//Create a Simple Props Drilling Example//
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// BottomMainRight component (deeply nested)
const BottomMainRight = ({ userName }) => {
  return (
    <div style={{ border: "1px solid blue", padding: "10px", marginTop: "10px" }}>
      <h3>BottomMainRight Component</h3>
      <p>User Name: {userName}</p>
    </div>
  );
};

// BottomMain component
const BottomMain = ({ userName }) => {
  return (
    <div style={{ border: "1px solid green", padding: "10px" }}>
      <h2>BottomMain Component</h2>
      <BottomMainRight userName={userName} />
    </div>
  );
};

// MiddleMain component
const MiddleMain = ({ userName }) => {
  return (
    <div style={{ border: "1px solid orange", padding: "10px" }}>
      <h2>MiddleMain Component</h2>
      <BottomMain userName={userName} />
    </div>
  );
};

// TopMain component
const TopMain = ({ userName }) => {
  return (
    <div style={{ border: "1px solid red", padding: "10px" }}>
      <h2>TopMain Component</h2>
      <MiddleMain userName={userName} />
    </div>
  );
};

// App component (Parent)
const App = () => {
  const [userName, setUserName] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Props Drilling Example</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px" }}
      />
      <TopMain userName={userName} />
    </div>
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
