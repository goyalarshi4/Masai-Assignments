//Building a Simple Express App with User Routes//
const express = require("express");
const app = express();

// Middleware for logging (optional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Dummy user data
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
  { id: 3, name: "Bob Smith", email: "bob@example.com" },
];

// Route: GET /users/get
app.get("/users/get", (req, res) => {
  const user = users[0]; // Return the first user as the "single user"
  res.status(200).json(user);
});

// Route: GET /users/list
app.get("/users/list", (req, res) => {
  res.status(200).json(users);
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

//README//
// # Simple Express App with User Routes

// ## 📚 Objective

// This is a basic Express.js app that provides user-related routes. It responds with dummy data for a single user and a list of users.

// ## 🚀 Features

// - `GET /users/get` → Responds with a single dummy user.
// - `GET /users/list` → Responds with a list of three dummy users.
// - Handles undefined routes with a `"404 Not Found"` message.

// ## 🏗️ How to Run

// ### 1. Initialize the project

// ```bash
// npm init -y