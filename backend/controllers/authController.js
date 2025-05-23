const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate unique username
const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      return username;
    }
    username = `${baseUsername}${counter}`;
    counter++;
  }
};

// Signup handler
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    
    // Generate unique username if the requested one already exists
    const uniqueUsername = await generateUniqueUsername(username);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with unique username
    const newUser = await User.create({
      username: uniqueUsername,
      email,
      password: hashedPassword,
    });
    
    // Response includes original and final username if they differ
    const response = {
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    };
    
    // Inform user if username was modified
    if (uniqueUsername !== username) {
      response.message = `User registered successfully! Username '${username}' was taken, so you've been assigned '${uniqueUsername}'.`;
      response.originalUsername = username;
    }
    
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login handler (can accept either email or username)
exports.login = async (req, res) => {
  const { email, password, username } = req.body;
  
  try {
    let user;
    
    // Allow login with either email or username
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { username } });
    } else {
      return res.status(400).json({ message: "Please provide email or username" });
    }
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check username availability
exports.checkUsername = async (req, res) => {
  const { username } = req.params;
  
  try {
    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
      const suggestedUsername = await generateUniqueUsername(username);
      res.json({
        available: false,
        message: "Username is already taken",
        suggested: suggestedUsername
      });
    } else {
      res.json({
        available: true,
        message: "Username is available"
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout handler
exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};