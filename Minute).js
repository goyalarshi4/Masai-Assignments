//Implementing Rate Limiting in Express (5 Requests/Minute)
//
const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

// Rate limiter middleware (5 requests per minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: { error: "Too many requests, please try again later." },
});

// Public route (no rate limit)
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public endpoint!" });
});

// Limited route (rate limiter applied)
app.get("/api/limited", limiter, (req, res) => {
  res.json({ message: "You have access to this limited endpoint!" });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
