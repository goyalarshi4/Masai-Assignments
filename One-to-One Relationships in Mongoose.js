//One-to-One Relationships in Mongoose//
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/oneToOneExample", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('strictQuery', false);

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Profile Schema
const profileSchema = new mongoose.Schema({
  bio: String,
  socialMediaLinks: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

// Models
const User = mongoose.model("User", userSchema);
const Profile = mongoose.model("Profile", profileSchema);

// Routes

// Add a new user
app.post("/add-user", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || name.length < 3 || !email) {
      return res.status(400).json({ error: "Invalid name or email" });
    }

    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new profile
app.post("/add-profile", async (req, res) => {
  try {
    const { bio, socialMediaLinks, user } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileExists = await Profile.findOne({ user });
    if (profileExists) {
      return res.status(400).json({ error: "Profile already exists for this user" });
    }

    const newProfile = new Profile({ bio, socialMediaLinks, user });
    await newProfile.save();
    res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all profiles with user populated
app.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "name email");
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
