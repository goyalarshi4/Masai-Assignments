//Advanced Library Management System//
const express = require("express");
const mongoose = require("mongoose");

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/LibraryDB", {
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

// --- Library Schema & Model ---
const librarySchema = new mongoose.Schema({
  title: String,
  author: String,
  status: {
    type: String,
    default: "available", // "available", "borrowed", "reserved"
  },
  borrowerName: String,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  overdueFees: {
    type: Number,
    default: 0,
  },
});
const Library = mongoose.model("Library", librarySchema);

// --- Middleware ---

// Validation Middleware - check required fields for adding a book
const validateBookData = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Incomplete Data" });
  }
  next();
};

// Borrowing Middleware - check if user has borrowed less than 3 books
const checkBorrowLimit = async (req, res, next) => {
  try {
    const { borrowerName } = req.body;
    if (!borrowerName) {
      return res
        .status(400)
        .json({ error: "Borrower name is required to borrow a book" });
    }
    const borrowedCount = await Library.countDocuments({
      borrowerName,
      status: "borrowed",
    });
    if (borrowedCount >= 3) {
      return res.status(409).json({
        error: `Borrowing limit exceeded. User '${borrowerName}' has already borrowed 3 books.`,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- Express Setup ---
const app = express();
app.use(express.json());

// --- Routes & Controllers ---

// Add a Book (POST /library/books)
app.post("/library/books", validateBookData, async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = new Library({
      title,
      author,
      status: "available",
      overdueFees: 0,
    });
    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Borrow a Book (PATCH /library/borrow/:id)
app.patch("/library/borrow/:id", checkBorrowLimit, async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "available") {
      return res
        .status(409)
        .json({ error: "Book is not available for borrowing" });
    }

    const { borrowerName } = req.body;
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from borrow date

    book.status = "borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = borrowDate;
    book.dueDate = dueDate;
    book.returnDate = null;
    book.overdueFees = 0;

    await book.save();
    res.json({
      message: "Book borrowed successfully",
      book,
      dueDate: dueDate.toISOString().slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Return a Book (PATCH /library/return/:id)
app.patch("/library/return/:id", async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "borrowed") {
      return res
        .status(409)
        .json({ error: "Book is not currently borrowed" });
    }

    const returnDate = new Date();
    let overdueFees = 0;
    if (book.dueDate && returnDate > book.dueDate) {
      // Calculate days overdue
      const diffTime = returnDate.getTime() - book.dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      overdueFees = diffDays * 10; // Rs. 10 per day
    }

    book.status = "available";
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;
    book.returnDate = returnDate;
    book.overdueFees = overdueFees;

    await book.save();
    res.json({
      message: "Book returned successfully",
      overdueFees,
      book,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve Books (GET /library/books)
app.get("/library/books", async (req, res) => {
  try {
    const { status, title } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };
    const books = await Library.find(filter);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Book (DELETE /library/books/:id)
app.delete("/library/books/:id", async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status === "borrowed") {
      return res
        .status(409)
        .json({ error: "Cannot delete a borrowed book" });
    }
    await Library.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
