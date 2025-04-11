const bcrypt = require('bcryptjs');
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Constants
const JWT_EXPIRATION = 3600 * 1000; // 1 hour in milliseconds
const BCRYPT_SALT_ROUNDS = 10;

//Build the account management view
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/account-management', {
    title: 'Account Management',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  try {
    const hashedPassword = await bcrypt.hash(
      account_password,
      BCRYPT_SALT_ROUNDS
    );
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        'notice',
        `Congratulations, you're registered as ${account_firstname}. Please log in.`
      );
      res.status(201).render('account/login', {
        title: 'Login',
        errors: null,
        nav,
      });
    } else {
      req.flash('notice', 'Sorry, the registration failed.');
      res.status(501).render('account/register', {
        title: 'Registration',
        errors: null,
        nav,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // req.flash("notice", "This is a flash message.!!!@2")
  res.render('account/login', {
    title: 'Login',
    errors: null,
    nav,
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash('notice', 'Please check your credentials and try again.');
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (passwordMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const cookieOptions = {
        httpOnly: true,
        maxAge: JWT_EXPIRATION,
        secure: process.env.NODE_ENV !== 'development',
      };

      res.cookie('jwt', accessToken, cookieOptions);
      return res.redirect('/account/');
    } else {
      req.flash('notice', 'Please check your credentials and try again.');
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash('notice', 'An error occurred during login. Please try again.');
    res.status(500).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
  }
}

//Build account update view
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const accountDetail = await accountModel.getAccountById(req.params.accountId);
  const { account_id, account_firstname, account_lastname, account_email } =
    accountDetail;
  res.render('account/account-update', {
    title: 'Account Update',
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  });
}

//Build account update
async function updateAccount(req, res) {
  const nav = await utilities.getNav();

  // 1. Get account data from form and user session
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  // 2. Update database with new information
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash('notice', `Successfully updated ${account_firstname}'s account!`);

    const accountData = await accountModel.getAccountById(account_id);
    delete accountData.account_password; // Remove password from object
    res.locals.accountData.account_firstname = accountData.account_firstname;
    utilities.updateCookie(accountData, res);

    res.status(201).render('account/account-management', {
      title: 'Account Management',
      errors: null,
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, the account update failed. Please try again.');
    res.status(501).render('account/account-update', {
      title: 'Account Update',
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    });
  }
}

//Process account update password
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      account_password,
      BCRYPT_SALT_ROUNDS
    );
    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updateResult) {
      req.flash('notice', 'Successfully updated your password!');
      res.status(200).render('account/account-management', {
        title: 'Account Management',
        errors: null,
        nav,
      });
    } else {
      req.flash(
        'notice',
        'Sorry, the password update failed. Please try again.'
      );
      res.status(400).render('account/account-update', {
        title: 'Account Update',
        errors: null,
        nav,
      });
    }
  } catch (error) {
    console.error('Password update error:', error);
    req.flash(
      'notice',
      'Sorry, there was an error processing the password update.'
    );
    res.status(500).render('account/account-update', {
      title: 'Account Update',
      nav,
      errors: null,
    });
  }
}

//Process Account logout
async function accountLogout(req, res) {
  res.clearCookie('jwt');
  delete res.locals.accountData;
  res.locals.loggedin = null;
  req.flash('notice', 'You have been logged out.');
  res.redirect('/account/login');
  return;
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  buildAccountUpdate,
  accountLogout,
  updateAccount,
  updatePassword,
};
