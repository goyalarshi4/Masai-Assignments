//User & Address Management System//
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/userAddressSystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Address Subdocument Schema ---
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "India" },
  pincode: { type: String, required: true },
});

// --- User Schema ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  age: { type: Number, required: true },
  addresses: [addressSchema],
});

const User = mongoose.model("User", userSchema);

// --- Routes ---

// Create User
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Address to User
app.post("/users/:userId/address", async (req, res) => {
  try {
    const { userId } = req.params;
    const address = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.addresses.push(address);
    await user.save();

    res.status(200).json({ message: "Address added", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Summary
app.get("/users/summary", async (req, res) => {
  try {
    const users = await User.find();
    const totalUsers = users.length;
    const totalAddresses = users.reduce(
      (sum, user) => sum + user.addresses.length,
      0
    );

    const userSummary = users.map((user) => ({
      name: user.name,
      addressCount: user.addresses.length,
    }));

    res.status(200).json({
      totalUsers,
      totalAddresses,
      userSummary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Full User Details
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bonus: Delete a specific address from a user
app.delete("/users/:userId/address/:addressId", async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );
    await user.save();

    res.status(200).json({ message: "Address removed", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`User & Address Management Server running at http://localhost:${PORT}`);
});
