// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logService = require('../services/loggerService');

exports.signup = async (req, res) => {
  const { username, password, email, role } = req.body;
  
  // Log the signup attempt
  logService.info(`Attempting to register user with email: ${email} and username: ${username}`);
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logService.warn(`User already exists with email: ${email}`);
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      passwordHash,
      email,
      role: role || 'user', // Default to 'user' if no role provided
    });

    const savedUser = await newUser.save();
    logService.verbose(`User registered successfully with email: ${email}`);
    res.status(201).json(savedUser);
  } catch (error) {
    logService.error(`Error registering user with email: ${email} - ${error.message}`);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  
  // Log the login attempt
  logService.info(`Attempting login for user with email: ${email} or username: ${username}`);
  
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (!user) {
      logService.warn(`Invalid login attempt for email: ${email} or username: ${username}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logService.warn(`Invalid password attempt for user: ${username} or email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    logService.verbose(`Login successful for user: ${username} or email: ${email}`);
    res.json({ token });
  } catch (error) {
    logService.error(`Error during login for email: ${email} or username: ${username} - ${error.message}`);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.logout = (req, res) => {
  // Log the logout event
  logService.info(`User logout requested`);

  res.json({ message: 'Logout successful. Please delete the token on client side.' });
};
