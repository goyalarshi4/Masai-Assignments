//Build a Todo Application – A Developer’s Request
//
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Path to the database file
const DB_FILE = path.join(__dirname, "db.json");

// Helper functions to interact with db.json
function readTodos() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

// GET /todos → Returns all todos
app.get("/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST /todos → Add a new todo
app.post("/todos", (req, res) => {
  const todos = readTodos();
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title,
    completed: completed || false,
  };

  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// GET /todos/search?q=partial → Search todos by partial title (case-insensitive)
app.get("/todos/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

  const todos = readTodos();
  const results = todos.filter(todo =>
    todo.title.toLowerCase().includes(q.toLowerCase())
  );

  res.json(results);
});

// PUT /todos/:id → Update a todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (title !== undefined) todos[index].title = title;
  if (completed !== undefined) todos[index].completed = completed;

  writeTodos(todos);
  res.json(todos[index]);
});

// DELETE /todos/:id → Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const index = todos.findIndex(todo => todo.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const deleted = todos.splice(index, 1);
  writeTodos(todos);
  res.json({ message: "Todo deleted", todo: deleted[0] });
});

// Handle undefined routes → 404 Not Found
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
