//Simple Dishes API//
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

// Helper function to read db.json and parse it
const readDb = () => {
  const data = fs.readFileSync("db.json", "utf-8");
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDb = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

// Route: POST /dishes (Add a new dish)
app.post("/dishes", (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const dishes = readDb();
  const newDish = {
    id: dishes.length ? dishes[dishes.length - 1].id + 1 : 1,
    name,
    price,
    category,
  };

  dishes.push(newDish);
  writeDb(dishes);

  res.status(201).json(newDish);
});

// Route: GET /dishes (Retrieve all dishes)
app.get("/dishes", (req, res) => {
  const dishes = readDb();
  res.status(200).json(dishes);
});

// Route: GET /dishes/:id (Retrieve a dish by its ID)
app.get("/dishes/:id", (req, res) => {
  const { id } = req.params;
  const dishes = readDb();
  const dish = dishes.find((d) => d.id === parseInt(id));

  if (!dish) {
    return res.status(404).json({ error: "Dish not found" });
  }

  res.status(200).json(dish);
});

// Route: PUT /dishes/:id (Update a dish by its ID)
app.put("/dishes/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const dishes = readDb();
  const dishIndex = dishes.findIndex((d) => d.id === parseInt(id));

  if (dishIndex === -1) {
    return res.status(404).json({ error: "Dish not found" });
  }

  dishes[dishIndex] = { id: parseInt(id), name, price, category };
  writeDb(dishes);

  res.status(200).json(dishes[dishIndex]);
});

// Route: DELETE /dishes/:id (Delete a dish by its ID)
app.delete("/dishes/:id", (req, res) => {
  const { id } = req.params;
  const dishes = readDb();
  const dishIndex = dishes.findIndex((d) => d.id === parseInt(id));

  if (dishIndex === -1) {
    return res.status(404).json({ error: "Dish not found" });
  }

  dishes.splice(dishIndex, 1);
  writeDb(dishes);

  res.status(204).send();
});

// Route: GET /dishes/get?name=<dish_name> (Search for dishes by name)
app.get("/dishes/get", (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Please provide a name to search" });
  }

  const dishes = readDb();
  const matchingDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(name.toLowerCase())
  );

  if (matchingDishes.length === 0) {
    return res.status(404).json({ message: "No dishes found" });
  }

  res.status(200).json(matchingDishes);
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
// # Simple Dishes API

// ## 📚 Objective

// This is an Express.js API that provides CRUD operations for managing dishes. It allows users to add, view, update, delete, and search for dishes by name.

// ## 🚀 Features

// - `POST /dishes` → Add a new dish.
// - `GET /dishes` → Retrieve all dishes.
// - `GET /dishes/:id` → Retrieve a dish by its ID.
// - `PUT /dishes/:id` → Update a dish by its ID.
// - `DELETE /dishes/:id` → Delete a dish by its ID.
// - `GET /dishes/get?name=<dish_name>` → Search for dishes by name (supports partial matches).

// ## 🏗️ Setup

// ### 1. Initialize the project

// ```bash
// npm init -y
