//Task Management System//
const express = require("express");
const mongoose = require("mongoose");

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TaskDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();

// --- Task Schema & Model ---
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  completionDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
});
const Task = mongoose.model("Task", taskSchema);

// --- Middleware ---
const allowedPriorities = ["low", "medium", "high"];

const validateTaskData = async (req, res, next) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Incomplete Data Received" });
  }
  if (!allowedPriorities.includes(priority)) {
    return res
      .status(400)
      .json({ error: "Priority must be one of low, medium, or high" });
  }
  if (req.method === "POST") {
    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(400).json({ error: "Title must be unique" });
    }
  }
  next();
};

const validateUpdateData = (req, res, next) => {
  const allowedUpdates = ["title", "priority", "description", "isCompleted"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid update fields" });
  }
  if (req.body.priority) {
    if (!allowedPriorities.includes(req.body.priority)) {
      return res
        .status(400)
        .json({ error: "Priority must be one of low, medium, or high" });
    }
  }
  next();
};

// --- Express Setup ---
const app = express();
app.use(express.json());

// --- Routes & Controllers ---

// Create Task
app.post("/api/tasks", validateTaskData, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Tasks with optional filtering by priority or status
app.get("/api/tasks", async (req, res) => {
  try {
    const { priority, status } = req.query;
    const filter = {};
    if (priority) filter.priority = priority;
    if (status) {
      if (status === "completed") filter.isCompleted = true;
      else if (status === "pending") filter.isCompleted = false;
    }
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task by ID
app.patch("/api/tasks/:id", validateUpdateData, async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (updates.title) task.title = updates.title;
    if (updates.priority) task.priority = updates.priority;
    if (updates.description) task.description = updates.description;

    if (
      updates.isCompleted !== undefined &&
      updates.isCompleted === true &&
      !task.isCompleted
    ) {
      task.isCompleted = true;
      task.completionDate = new Date();
    }

    await task.save();
    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete tasks filtered by priority (bulk delete)
app.delete("/api/tasks", async (req, res) => {
  try {
    const { priority } = req.query;
    if (!priority) {
      return res.status(400).json({ error: "Priority filter is required" });
    }
    const result = await Task.deleteMany({ priority });
    res.json({
      message: `${result.deletedCount} tasks deleted with priority '${priority}'`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
