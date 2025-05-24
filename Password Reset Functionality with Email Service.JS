//Password Reset Functionality with Email Service//
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// === CONFIG ===
const ACCESS_SECRET = 'access_secret';
const REFRESH_SECRET = 'refresh_secret';
const RESET_SECRET = 'reset_secret';
const MONGO_URI = 'mongodb://127.0.0.1:27017/auth-demo';
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

// === DB CONNECTION ===
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === USER SCHEMA ===
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiry: Date
});
const User = mongoose.model('User', userSchema);

// === TOKEN GENERATORS ===
const generateAccessToken = user =>
  jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: '15m' });
const generateRefreshToken = user =>
  jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

// === AUTH MIDDLEWARE ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token expired or invalid' });
    req.user = user;
    next();
  });
};

// === REGISTER ===
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch {
    res.status(400).json({ message: 'Email already exists' });
  }
});

// === LOGIN ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
});

// === TOKEN REFRESH ===
app.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = generateAccessToken({ _id: user.userId });
    res.json({ accessToken: newAccessToken });
  });
});

// === PROTECTED ROUTE ===
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route', userId: req.user.userId });
});

// === NODEMAILER SETUP ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // <-- replace with real email
    pass: 'your-app-password'     // <-- use app password (not your email password)
  }
});

// === FORGOT PASSWORD ===
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);
  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins
  await user.save();

  const resetLink = `${BASE_URL}/reset-password?token=${resetToken}&email=${email}`;
  const mailOptions = {
    from: 'no-reply@movieapp.com',
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`
  };

  transporter.sendMail(mailOptions, err => {
    if (err) return res.status(500).json({ message: 'Email failed to send' });
    res.json({ message: 'Reset email sent successfully' });
  });
});

// === RESET PASSWORD ===
app.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now())
    return res.status(400).json({ message: 'Token expired or invalid' });

  const isValid = await bcrypt.compare(token, user.resetToken);
  if (!isValid) return res.status(401).json({ message: 'Invalid token' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
