//Secure Authentication, Email Reset, and Data Population in Movie API//
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

// === ENVIRONMENT VARIABLES ===
const ACCESS_SECRET = 'access_secret_key';
const REFRESH_SECRET = 'refresh_secret_key';
const MONGO_URI = 'mongodb://127.0.0.1:27017/auth-demo';

// === CONNECT TO DB ===
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error', err));

// === USER SCHEMA ===
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
});
const User = mongoose.model('User', userSchema);

// === GENERATE TOKENS ===
const generateAccessToken = (user) =>
    jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (user) =>
    jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

// === MIDDLEWARE TO PROTECT ROUTES ===
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
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
    } catch (err) {
        res.status(400).json({ message: 'Email already exists' });
    }
});

// === LOGIN ===
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

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
    res.json({ message: 'This is protected data!', userId: req.user.userId });
});

// === SERVER START ===
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
