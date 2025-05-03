//Simple Multi-Page Navigation//
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Page Components
const Home = () => (
  <div>
    <h1>Welcome to Home Page</h1>
  </div>
);

const About = () => (
  <div>
    <h1>Welcome to About Page</h1>
  </div>
);

const Contact = () => (
  <div>
    <h1>Welcome to Contact Page</h1>
  </div>
);

// Navigation Component
const Navbar = () => (
  <nav style={{ marginBottom: "20px" }}>
    <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
    <Link to="/about" style={{ marginRight: "15px" }}>About</Link>
    <Link to="/contact">Contact</Link>
  </nav>
);

// Main App Component
const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
