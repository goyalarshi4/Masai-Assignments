//Library Management System(Databases)//
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/librarySystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

// --- Schema Definitions ---

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true },
  status: { type: String, enum: ["available", "borrowed"], default: "available" },
  borrowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  createdAt: { type: Date, default: Date.now },
});

// Pre Hook: Ensure book is available before borrowing
bookSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "borrowed" && this.borrowers.length === 0) {
    return next(new Error("Book cannot be marked as borrowed without borrowers"));
  }
  next();
});

// Post Hook: Set status to "available" when all borrowers return the book
bookSchema.post("save", async function (doc) {
  if (doc.borrowers.length === 0 && doc.status !== "available") {
    doc.status = "available";
    await doc.save();
  }
});

// Models
const Book = mongoose.model("Book", bookSchema);
const Member = mongoose.model("Member", memberSchema);

// --- Routes ---

// Add Member
app.post("/add-member", async (req, res) => {
  try {
    const { name, email } = req.body;
    const member = new Member({ name, email });
    await member.save();
    res.status(201).json({ message: "Member added", member });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Book
app.post("/add-book", async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = new Book({ title, author });
    await book.save();
    res.status(201).json({ message: "Book added", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Borrow Book
app.post("/borrow-book", async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);
    if (!member || !book) return res.status(404).json({ error: "Member or Book not found" });

    if (book.status === "borrowed") {
      return res.status(400).json({ error: "Book is already borrowed" });
    }

    member.borrowedBooks.push(bookId);
    book.borrowers.push(memberId);
    book.status = "borrowed";

    await member.save();
    await book.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Return Book
app.post("/return-book", async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);
    if (!member || !book) return res.status(404).json({ error: "Member or Book not found" });

    member.borrowedBooks = member.borrowedBooks.filter(id => id.toString() !== bookId);
    book.borrowers = book.borrowers.filter(id => id.toString() !== memberId);

    // If no more borrowers, set status to "available"
    if (book.borrowers.length === 0) {
      book.status = "available";
    }

    await member.save();
    await book.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Member Borrowed Books
app.get("/member-borrowed-books/:memberId", async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId).populate("borrowedBooks");
    if (!member) return res.status(404).json({ error: "Member not found" });

    res.status(200).json({ member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Book Borrowers
app.get("/book-borrowers/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("borrowers");
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Book
app.put("/update-book/:bookId", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ message: "Book updated", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Book
app.delete("/delete-book/:bookId", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await Member.updateMany(
      { borrowedBooks: book._id },
      { $pull: { borrowedBooks: book._id } }
    );

    res.status(200).json({ message: "Book deleted and members updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Library Management Server running at http://localhost:${PORT}`);
});
