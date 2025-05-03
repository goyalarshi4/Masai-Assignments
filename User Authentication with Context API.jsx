//User Authentication with Context API//
import React, { useState, useContext, createContext } from "react";
import ReactDOM from "react-dom/client";

// 1. Create Auth Context
const AuthContext = createContext();

// 2. Auth Provider
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn((prev) => !prev);

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Navbar Component
const Navbar = () => {
  const { isLoggedIn, toggleAuth } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", background: "#ddd" }}>
      <button onClick={toggleAuth}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </nav>
  );
};

// 4. Main Component
const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <main style={{ padding: "20px" }}>
      <h2>{isLoggedIn ? "You are logged in!" : "Please log in to continue."}</h2>
    </main>
  );
};

// 5. Footer Component
const Footer = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <footer style={{ padding: "10px", background: "#ccc" }}>
      {isLoggedIn ? "Welcome, User" : "Please log in"}
    </footer>
  );
};

// 6. App Component
const App = () => {
  return (
    <div>
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
};

// 7. Render App inside AuthProvider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
