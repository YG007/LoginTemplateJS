// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logService = require('../services/loggerService');
const AuthService = require('../services/authService');

exports.signup = async (req, res) => {
  const { username, password, email, role } = req.body;
  
  // Log the signup attempt
  logService.info(`Attempting to register user with email: ${email} and username: ${username}`);
  
  try{
    const savedUser = await AuthService.signup(username, password, email, role);
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
  

  try{
      const {statusCode, result} = await AuthService.login(username, password, email);
      if(statusCode === 400){
          logService.warn(`Invalid login attempt for email: ${email} or username: ${username}`);
          return res.status(400).json(result);
      }
      res.status(statusCode).json(result);

  } catch(err){
      logService.error(`Error during login for email: ${email} or username: ${username} - ${err.message}`);
      res.status(500).json({ message: 'Error logging in', err });
  }
     

};

exports.logout = (req, res) => {
  // Log the logout event

  const user = req.user;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  AuthService.logout(token, user);
  res.json({ message: 'Logout successful. Please delete the token on client side.' });
};
