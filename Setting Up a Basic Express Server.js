//Setting Up a Basic Express Server//
const express = require("express");
const app = express();

// Middleware (Optional: for logging requests)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route: GET /home
app.get("/home", (req, res) => {
  res.status(200).send("<h1>Welcome to Home Page</h1>");
});

// Route: GET /aboutus
app.get("/aboutus", (req, res) => {
  res.status(200).json({ message: "Welcome to About Us" });
});

// Route: GET /contactus
app.get("/contactus", (req, res) => {
  res.status(200).json({
    phone: "+91-9876543210",
    email: "contact@example.com",
    address: "123, Masai Street, Bengaluru",
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
  //README//
//   # Basic Express Server

// ## 📚 Objective

// Create a simple Express.js server that handles basic routing and error responses.

// ## 🚀 Features

// - `GET /home` → Responds with HTML: `"Welcome to Home Page"`
// - `GET /aboutus` → Responds with JSON: `{ "message": "Welcome to About Us" }`
// - `GET /contactus` → Responds with dummy contact details (phone, email, address)
// - Handles undefined routes with a `"404 Not Found"` message

// ## 🏗️ How to Run

// ### 1. Initialize the project

// ```bash
// npm init -y
