const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./db'); // Import the user model

// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // <-- Add this line

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/apk_analyzer';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- User Sign-in Route ---
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Compare the provided password with the stored hashed password
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials.' });
    // }

    // 3. If credentials are valid, send a success response
    // In a real application, you would generate and return a JSON Web Token (JWT) here.
    res.status(200).json({ 
        message: 'Sign-in successful!',
        // token: 'YOUR_JWT_TOKEN_HERE' 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));