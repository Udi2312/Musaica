// controllers/authController.js
const bcrypt = require('bcryptjs'); // ADD THIS LINE
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body; // Added username
    const user = new User({ email, password, username });
    await user.save();

    // Log registration
    console.log(`New user registered: 
      Email: ${email} 
      Username: ${username}
      Password: ${password}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration Error:', err.message); // Added logging
    res.status(500).json({ 
      error: 'Registration failed',
      details: err.message 
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`Login failed: Email ${email} not found`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Log successful login
    console.log(`User logged in: 
      Email: ${email} 
      Token: ${jwt.sign({ id: user._id }, process.env.JWT_SECRET)}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err.message); // Added logging
    res.status(500).json({ 
      error: 'Login failed',
      details: err.message 
    });
  }
};