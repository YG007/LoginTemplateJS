// server.js
const express = require('express');
const mongoose = require('mongoose');
const requestId = require('express-request-id').default;
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contextService = require('./services/contextService');
const loggerService = require('./services/loggerService');

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestId());
app.use(contextService.middleware); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      loggerService.info(
        `Server running on port ${process.env.PORT}`
      )
    );
  })
  .catch(err => loggerService.error('Database connection error: ' + err.message));