//Basic Context API Implementation//
import React, { createContext, useState, useContext } from "react";
import ReactDOM from "react-dom/client";

// 1. Create Theme Context
const ThemeContext = createContext();

// 2. Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Deeply Nested Component
const NestedComponent = () => {
  const { theme } = useContext(ThemeContext);
  const styles = {
    backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
    color: theme === "light" ? "#000" : "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "8px",
  };

  return <div style={styles}>This is a nested component in {theme} theme</div>;
};

// 4. App Component
const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const appStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#121212",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial",
  };

  return (
    <div style={appStyles}>
      <h1>Context API Theme Toggle</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
      <NestedComponent />
    </div>
  );
};

// 5. Render App within ThemeProvider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
