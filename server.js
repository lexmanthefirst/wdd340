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
const cookieParser = require('cookie-parser');

// Routes
const staticRoutes = require('./routes/static');
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require('./routes/accountRoute');
const intentionalErrorRoute = require('./routes/intentionalErrorRoute');

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
app.use(cookieParser()); // Handle cookies
app.use(utilities.checkJWTToken);
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
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);
app.use('/error', intentionalErrorRoute);

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
 * Global Error Handler
//  *************************/
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav();
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`);

//   // Determine if it's a 404 or other error
//   const status = err.status || 500;
//   const message =
//     status === 404
//       ? err.message
//       : 'Oh no! There was a server error. Please try again later.';

//   // For 500 errors, include stack trace in development
//   const errorDetails =
//     status === 500 && process.env.NODE_ENV === 'development' ? err.stack : null;

//   res.status(status).render('errors/error', {
//     title: status === 404 ? 'Page Not Found' : 'Server Error',
//     message,
//     nav,
//     error: errorDetails,
//   });
// });
/* ***********************
 * Server Startup
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
