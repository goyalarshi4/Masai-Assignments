//Task Management System with MongoDB Integration using Mongoose//
// index.js

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 1. Connect to MongoDB TaskDB
mongoose.connect("mongodb://127.0.0.1:27017/TaskDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// 2. Define Task Schema and Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: String,
  dueDate: Date,
});

const Task = mongoose.model("Task", taskSchema);

// 3. CRUD API routes for Tasks

// Create a new Task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Tasks or filter by status/dueDate (query params)
app.get("/tasks", async (req, res) => {
  try {
    const { status, dueDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task updated", updatedTask });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
