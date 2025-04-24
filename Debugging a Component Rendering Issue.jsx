//Debugging a Component Rendering Issue//
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// Reusable Card component
const Card = ({ title, children }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

// Parent component rendering three different cards
const App = () => {
  return (
    <div style={styles.container}>
      <Card title="Card 1">
        <p>This is the content of the first card.</p>
      </Card>
      <Card title="Card 2">
        <ul>
          <li>React</li>
          <li>JavaScript</li>
          <li>CSS</li>
        </ul>
      </Card>
      <Card title="Card 3">
        <p>This one contains a button:</p>
        <button style={styles.button}>Click Me</button>
      </Card>
    </div>
  );
};

// Inline styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
    flexWrap: "wrap"
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    width: "250px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

ReactDOM.render(<App />, document.getElementById("root"));
