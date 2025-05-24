//Movie Reviews and Data Population//
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
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;
const MONGO_URI = 'mongodb://127.0.0.1:27017/movie-api';

// === DB CONNECTION ===
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// === SCHEMAS ===
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiry: Date
});

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number
});

const reviewSchema = new mongoose.Schema({
  movieId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  rating: Number,
  comment: String
});

const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);
const Review = mongoose.model('Review', reviewSchema);

// === TOKEN HANDLING ===
const generateAccessToken = user =>
  jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: '15m' });
const generateRefreshToken = user =>
  jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired" });
    req.user = user;
    next();
  });
};

// === NODEMAILER SETUP ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // replace
    pass: 'your-app-password'     // use Gmail app password
  }
});

// === AUTH ROUTES ===
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await new User({ email, password: hashed }).save();
    res.status(201).json({ message: 'Registered' });
  } catch {
    res.status(400).json({ message: 'Email already exists' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
});

app.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = generateAccessToken({ _id: user.userId });
    res.json({ accessToken: newAccessToken });
  });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', userId: req.user.userId });
});

// === PASSWORD RESET ===
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);
  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const link = `${BASE_URL}/reset-password?token=${resetToken}&email=${email}`;
  await transporter.sendMail({
    from: 'no-reply@movieapp.com',
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${link}">here</a> to reset your password. Token expires in 15 minutes.</p>`
  });

  res.json({ message: 'Reset email sent' });
});

app.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.resetTokenExpiry < Date.now())
    return res.status(400).json({ message: 'Invalid or expired token' });

  const valid = await bcrypt.compare(token, user.resetToken);
  if (!valid) return res.status(403).json({ message: 'Invalid token' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ message: 'Password updated' });
});

// === MOVIES & REVIEWS ===
app.post('/movies', authenticateToken, async (req, res) => {
  const { title, genre, year } = req.body;
  const movie = new Movie({ title, genre, year });
  await movie.save();
  res.status(201).json({ message: 'Movie created', movie });
});

app.post('/reviews', authenticateToken, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const review = new Review({
    movieId,
    userId: req.user.userId,
    rating,
    comment
  });
  await review.save();
  res.status(201).json({ message: 'Review submitted', review });
});

app.get('/movies', async (req, res) => {
  const movies = await Movie.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'movieId',
        as: 'reviews'
      }
    }
  ]);
  res.json(movies);
});

app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'movieId',
        as: 'reviews'
      }
    }
  ]);
  res.json(movie[0]);
});

// === START SERVER ===
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
