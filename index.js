const express = require('express');
const mongoose = require('mongoose');
const { dbUrl, dbOptions } = require('./config/dbConfig');
const authMiddleware = require('./middlewares/auth');
const userRoutes = require('./routes/user');
const errorsMiddleware = require('./middlewares/errors');

const app = express();

mongoose.connect(dbUrl, dbOptions)
  .then(() => {
    console.log('Database Connected');
  })
  .catch(error => {
    console.log('Database cannot be connected:', error);
  });

app.use(express.json());

// Authenticate token for all routes except login and register

app.use((req, res, next) => {
  if (req.url === '/users/login' || req.url === '/users/register') {
    return next();
  }
  authMiddleware.authenticateToken(req, res, next);
});

app.use('/users', userRoutes);
app.use(errorsMiddleware.errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

