/* ******************************************
 * Primary server file of the application.
 * Controls the project setup and execution.
 ******************************************/

/* ***********************
 * Environment Setup
 *************************/
require('dotenv').config();

/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const connectFlash = require('connect-flash');
const expressMessages = require('express-messages');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./database/');
const utilities = require('./utilities/');

// Routes
const staticRoutes = require('./routes/static');
const inventoryRoutes = require('./routes/inventoryRoute');
const accountRoutes = require('./routes/accountRoute');
const intentionalErrorRoutes = require('./routes/intentionalErrorRoute');

// Controllers
const baseController = require('./controllers/baseController');

/* ***********************
 * Express App Initialization
 *************************/
const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Handle form submissions

// Session Middleware
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })
);

// Flash Messages Middleware
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes);
app.get('/', utilities.handleErrors(baseController.buildHome));
app.use('/inv', inventoryRoutes);
app.use('/account', accountRoutes);
app.use('/error', intentionalErrorRoutes);

// 404 Not Found Middleware (must be last route)
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Server Startup
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
