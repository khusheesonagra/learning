require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    age: Number,
    createdAt: { type: Date, default: Date.now }
});

// Progress Schema
const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mathProgress: { type: Number, default: 0 },
    readingProgress: { type: Number, default: 0 },
    memoryProgress: { type: Number, default: 0 },
    problemSolvingProgress: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    highestLevel: { type: Number, default: 1 }
});

// Game Score Schema
const gameScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gameType: String,
    score: Number,
    level: Number,
    completedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Progress = mongoose.model('Progress', progressSchema);
const GameScore = mongoose.model('GameScore', gameScoreSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// Routes

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, username, email, password, age } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            age
        });
        
        await user.save();
        
        // Create initial progress
        const progress = new Progress({ userId: user._id });
        await progress.save();
        
        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        
        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user progress
app.get('/api/progress', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.user._id });
        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user progress
app.patch('/api/progress', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.user._id });
        Object.assign(progress, req.body);
        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Save game score
app.post('/api/games/scores', auth, async (req, res) => {
    try {
        const { gameType, score, level } = req.body;
        
        const gameScore = new GameScore({
            userId: req.user._id,
            gameType,
            score,
            level
        });
        
        await gameScore.save();
        
        // Update user progress
        const progress = await Progress.findOne({ userId: req.user._id });
        progress.gamesPlayed += 1;
        progress.totalPoints += score;
        if (level > progress.highestLevel) {
            progress.highestLevel = level;
        }
        await progress.save();
        
        res.status(201).json(gameScore);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update profile
app.patch('/api/users/profile', auth, async (req, res) => {
    try {
        const updates = req.body;
        Object.assign(req.user, updates);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user profile
app.get('/api/users/profile', auth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
