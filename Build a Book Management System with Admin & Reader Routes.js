//Build a Book Management System with Admin & Reader Routes
//
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// ------------------- DB -------------------
const DB_PATH = path.join(__dirname, "db.json");

function readBooks() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (err) {
    return [];
  }
}

function writeBooks(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ------------------- Middleware -------------------
const loggerMiddleware = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(log);
  next();
};

const returnCheckMiddleware = (req, res, next) => {
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (book.status === "available") {
    return res.status(400).json({ error: "Book is not currently borrowed." });
  }

  const borrowDate = new Date(book.borrowedDate);
  const now = new Date();
  const diff = (now - borrowDate) / (1000 * 60 * 60 * 24); // in days

  if (diff < 3) {
    return res.status(400).json({
      error: "Book cannot be returned within 3 days of borrowing.",
    });
  }

  next();
};

const transactionLogger = (action, readerName, bookTitle) => {
  const log = `[${new Date().toISOString()}] ${readerName} ${action} "${bookTitle}"`;
  console.log(log);
};

// ------------------- Admin Routes -------------------
// POST /admin/books → Add a new book
app.post("/admin/books", loggerMiddleware, (req, res) => {
  const books = readBooks();
  const { title, author, genre, publishedYear } = req.body;

  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({ error: "Missing book details" });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    genre,
    publishedYear,
    status: "available",
  };

  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

// GET /admin/books → Get all books
app.get("/admin/books", loggerMiddleware, (req, res) => {
  res.json(readBooks());
});

// PATCH /admin/books/:id → Update book details
app.patch("/admin/books/:id", loggerMiddleware, (req, res) => {
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, genre, publishedYear } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (publishedYear) book.publishedYear = publishedYear;

  writeBooks(books);
  res.json(book);
});

// DELETE /admin/books/:id → Remove a book
app.delete("/admin/books/:id", loggerMiddleware, (req, res) => {
  const books = readBooks();
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const removed = books.splice(index, 1)[0];
  writeBooks(books);
  res.json({ message: "Book removed", book: removed });
});

// ------------------- Reader Routes -------------------
// GET /reader/books → Available books
app.get("/reader/books", loggerMiddleware, (req, res) => {
  const availableBooks = readBooks().filter(b => b.status === "available");
  res.json(availableBooks);
});

// POST /reader/borrow/:id → Borrow book
app.post("/reader/borrow/:id", loggerMiddleware, (req, res) => {
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (book.status === "borrowed") {
    return res.status(400).json({ error: "Book already borrowed" });
  }

  const { readerName } = req.body;
  if (!readerName) {
    return res.status(400).json({ error: "Reader name required" });
  }

  book.status = "borrowed";
  book.borrowedBy = readerName;
  book.borrowedDate = new Date().toISOString().split("T")[0];

  writeBooks(books);
  transactionLogger("borrowed", readerName, book.title);
  res.json({ message: "Book borrowed", book });
});

// POST /reader/return/:id → Return book
app.post(
  "/reader/return/:id",
  loggerMiddleware,
  returnCheckMiddleware,
  (req, res) => {
    const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));

    const readerName = book.borrowedBy;
    const title = book.title;

    book.status = "available";
    delete book.borrowedBy;
    delete book.borrowedDate;

    writeBooks(books);
    transactionLogger("returned", readerName, title);
    res.json({ message: "Book returned", book });
  }
);

// ------------------- 404 Handler -------------------
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// ------------------- Server -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📚 Book Management System running at http://localhost:${PORT}`);
});
