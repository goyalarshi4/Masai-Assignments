//Setting Up a Simple Express Server & Exploring Nodemon//
// index.js

const express = require('express');
const app = express();
const port = 3000;

// /home route
app.get('/home', (req, res) => {
  res.json({ message: 'This is home page' });
});

// /contactus route
app.get('/contactus', (req, res) => {
  res.json({ message: 'Contact us at contact@contact.com' });
});

// /about route (bonus)
app.get('/about', (req, res) => {
  res.json({ message: 'Welcome to the About page!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
