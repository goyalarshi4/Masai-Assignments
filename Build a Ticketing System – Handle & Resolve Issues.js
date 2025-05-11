//Build a Ticketing System – Handle & Resolve Issues//
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, "db.json");

// ------------------ Middleware ------------------

function dataCheckMiddleware(req, res, next) {
  const { title, description, priority, user } = req.body;
  if (!title || !description || !priority || !user) {
    return res.status(400).json({
      error: "Data insufficient, please provide all required fields",
    });
  }
  next();
}

// ------------------ Model ------------------

function readTickets() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeTickets(tickets) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2), "utf-8");
}

// ------------------ Controllers ------------------

function getAllTickets(req, res) {
  const tickets = readTickets();
  res.json(tickets);
}

function getTicketById(req, res) {
  const tickets = readTickets();
  const ticket = tickets.find(t => t.id === parseInt(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
}

function createTicket(req, res) {
  const tickets = readTickets();
  const { title, description, priority, user } = req.body;

  const newTicket = {
    id: tickets.length ? tickets[tickets.length - 1].id + 1 : 1,
    title,
    description,
    priority,
    user,
    status: "pending",
  };

  tickets.push(newTicket);
  writeTickets(tickets);
  res.status(201).json(newTicket);
}

function updateTicket(req, res) {
  const { id } = req.params;
  const { title, description, priority } = req.body;
  const tickets = readTickets();
  const ticket = tickets.find(t => t.id === parseInt(id));

  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  if (title !== undefined) ticket.title = title;
  if (description !== undefined) ticket.description = description;
  if (priority !== undefined) ticket.priority = priority;

  writeTickets(tickets);
  res.json(ticket);
}

function deleteTicket(req, res) {
  const { id } = req.params;
  const tickets = readTickets();
  const index = tickets.findIndex(t => t.id === parseInt(id));

  if (index === -1) return res.status(404).json({ error: "Ticket not found" });

  const removed = tickets.splice(index, 1);
  writeTickets(tickets);
  res.json({ message: "Ticket deleted", ticket: removed[0] });
}

function resolveTicket(req, res) {
  const { id } = req.params;
  const tickets = readTickets();
  const ticket = tickets.find(t => t.id === parseInt(id));

  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  ticket.status = "resolved";
  writeTickets(tickets);
  res.json(ticket);
}

// ------------------ Routes ------------------

const router = express.Router();

router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.post("/", dataCheckMiddleware, createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
router.patch("/:id/resolve", resolveTicket);

app.use("/tickets", router);

// ------------------ 404 Handler ------------------

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ------------------ Server ------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Ticketing system running at http://localhost:${PORT}`);
});
