const logService = require('../services/loggerService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



class AuthService{
    
    static async signup(username, password, email, role){
        try{
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logService.warn(`User already exists with email: ${email}`);
                return existingUser;
            }
        
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                passwordHash,
                email,
                role: role || 'user', // Default to 'user' if no role provided
            });
        
            const savedUser = await newUser.save();
            logService.info(`User registered successfully with email: ${email}`);
            return savedUser;
        } catch(err){
            logService.error(
                `Error during signup for email: ${email} - ${err.message}`,
                {meta: { source: 'AuthService.signup' }, email: email, username: username}
              );            
            throw err;
        }
        
    }

    static async login(username, password, email ) {
        try {

            const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
              });

              if (!user) {
                logService.warn(`Invalid login attempt for email: ${email} or username: ${username}`);
                return {statusCode:400, result:{ error: 'Invalid credentials' }}
              }

              const isMatch = await bcrypt.compare(password, user.passwordHash);
              if (!isMatch) {
                logService.warn(`Invalid password attempt for user: ${username} or email: ${email}`);
                return {statusCode:400, result:{ error: 'Invalid credentials' }}
              }

              const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1h'
              });
              logService.info(`Login successful for user: ${username} or email: ${email}`);
              return {statusCode:200, result:{ token }}

        } catch (error) {
            logService.error(
                `Error during login for email: ${email} or username: ${username} - ${error.message}`,
                {meta: { source: 'AuthService.login' }, email: email, username: username}
              );
                            
            throw error;
        }
    }

    static logout(token, user){
        logService.info(`User ${user.email} logout requested`);
        return true;
    }

}


module.exports= AuthService;
