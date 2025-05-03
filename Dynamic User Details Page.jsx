//Dynamic User Details Page//
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

// Dummy user data
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

// Component to show list of users with links
const UserList = () => (
  <div>
    <h2>User List</h2>
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {/* Link navigates to /users/:id */}
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

// Component to show user details using URL parameter
const UserDetails = () => {
  const { id } = useParams(); // Extract URL parameter
  const user = users.find(u => u.id === parseInt(id)); // Find user by id

  if (!user) {
    return <h3>User not found</h3>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Details of {user.name}.</p>
    </div>
  );
};

// Main App component with routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
