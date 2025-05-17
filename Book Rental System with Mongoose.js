//Book Rental System with Mongoose//
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookRental", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

// Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  rentedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true },
  genre: { type: String },
  rentedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Models
const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);

// Routes

// Add User
app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || name.length < 3 || !email) return res.status(400).json({ error: "Invalid user input" });

    const user = new User({ name, email });
    await user.save();
    res.status(201).json({ message: "User added", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Book
app.post("/add-book", async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || title.length < 3 || !author) return res.status(400).json({ error: "Invalid book input" });

    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json({ message: "Book added", book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rent Book
app.post("/rent-book", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ error: "User or Book not found" });

    if (!user.rentedBooks.includes(bookId)) user.rentedBooks.push(bookId);
    if (!book.rentedBy.includes(userId)) book.rentedBy.push(userId);

    await user.save();
    await book.save();
    res.status(200).json({ message: "Book rented successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Return Book
app.post("/return-book", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ error: "User or Book not found" });

    user.rentedBooks = user.rentedBooks.filter(id => id.toString() !== bookId);
    book.rentedBy = book.rentedBy.filter(id => id.toString() !== userId);

    await user.save();
    await book.save();
    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get User Rentals
app.get("/user-rentals/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("rentedBooks");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Book Renters
app.get("/book-renters/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("rentedBy");
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Book
app.put("/update-book/:bookId", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ message: "Book updated", book: updatedBook });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Book
app.delete("/delete-book/:bookId", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await User.updateMany(
      { rentedBooks: book._id },
      { $pull: { rentedBooks: book._id } }
    );

    res.status(200).json({ message: "Book deleted and users updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
