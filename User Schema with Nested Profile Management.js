//User Schema with Nested Profile Management//
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/userProfileDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to MongoDB");

// Schema
const profileSchema = new mongoose.Schema({
  profileName: {
    type: String,
    enum: ["fb", "twitter", "github", "instagram"],
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: "Invalid URL format",
    },
  },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: { type: String, required: true, minlength: 6 },
  profiles: [profileSchema],
});

const User = mongoose.model("User", userSchema);

// Routes

// 1. Add User
app.post("/add-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Add Profile to User
app.post("/add-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.profiles.find(p => p.profileName === profile.profileName);
    if (exists) return res.status(400).json({ message: "Profile already exists" });

    user.profiles.push(profile);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Get Users (with optional profile filter)
app.get("/get-users", async (req, res) => {
  try {
    const { profile } = req.query;

    let users = await User.find();
    if (profile) {
      users = users.filter(user =>
        user.profiles.some(p => p.profileName === profile)
      );
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Search User by Name and Profile
app.get("/search", async (req, res) => {
  try {
    const { name, profile } = req.query;

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    const foundProfile = user.profiles.find(p => p.profileName === profile);
    if (foundProfile) return res.status(200).json(foundProfile);

    res.status(200).json({
      message: "User found, but profile not found",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Update Profile
app.put("/update-profile/:userId/:profileName", async (req, res) => {
  try {
    const { userId, profileName } = req.params;
    const { url } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.profiles.find(p => p.profileName === profileName);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.url = url;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Delete Profile
app.delete("/delete-profile/:userId/:profileName", async (req, res) => {
  try {
    const { userId, profileName } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const initialLength = user.profiles.length;
    user.profiles = user.profiles.filter(p => p.profileName !== profileName);

    if (user.profiles.length === initialLength)
      return res.status(404).json({ message: "Profile not found" });

    await user.save();
    res.status(200).json({ message: "Profile deleted", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
