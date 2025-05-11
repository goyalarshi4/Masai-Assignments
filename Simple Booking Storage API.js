//Simple Booking Storage API//
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

// Route: POST /books (Add a new book)
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const books = readDb();
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year,
  };

  books.push(newBook);
  writeDb(books);

  res.status(201).json(newBook);
});

// Route: GET /books (Retrieve all books)
app.get("/books", (req, res) => {
  const books = readDb();
  res.status(200).json(books);
});

// Route: GET /books/:id (Retrieve a book by its ID)
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const books = readDb();
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(book);
});

// Route: PUT /books/:id (Update a book by its ID)
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const books = readDb();
  const bookIndex = books.findIndex((b) => b.id === parseInt(id));

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books[bookIndex] = { id: parseInt(id), title, author, year };
  writeDb(books);

  res.status(200).json(books[bookIndex]);
});

// Route: DELETE /books/:id (Delete a book by its ID)
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const books = readDb();
  const bookIndex = books.findIndex((b) => b.id === parseInt(id));

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(bookIndex, 1);
  writeDb(books);

  res.status(204).send();
});

// Route: GET /books/search (Search for books by author or title)
app.get("/books/search", (req, res) => {
  const { author, title } = req.query;

  if (!author && !title) {
    return res.status(400).json({ error: "Please provide an author or title to search" });
  }

  const books = readDb();
  let matchingBooks = [];

  if (author) {
    matchingBooks = books.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (title) {
    matchingBooks = matchingBooks.concat(
      books.filter((b) =>
        b.title.toLowerCase().includes(title.toLowerCase())
      )
    );
  }

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found" });
  }

  res.status(200).json(matchingBooks);
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
// # Simple Booking Storage API

// ## 📚 Objective

// This is an Express.js API that allows users to perform CRUD operations on a collection of books. It supports adding, retrieving, updating, and deleting books, as well as searching for books by author or title.

// ## 🚀 Features

// - `POST /books` → Add a new book.
// - `GET /books` → Retrieve all books.
// - `GET /books/:id` → Retrieve a book by its ID.
// - `PUT /books/:id` → Update a book by its ID.
// - `DELETE /books/:id` → Delete a book by its ID.
// - `GET /books/search?author=<author_name>` → Search books by author.
// - `GET /books/search?title=<book_title>` → Search books by title.

// ## 🏗️ Setup

// ### 1. Initialize the project

// ```bash
// npm init -y
