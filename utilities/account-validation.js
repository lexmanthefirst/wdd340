const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const { body, validationResult } = require('express-validator');
const validate = {};

//Registeration Data Validation Rules
validate.registrationRules = () => {
  return [
    //First is required and must be a string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),

    //Last is required and must be a string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),

    // valid email is required and cannot already exist in the database
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async account_email => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error('Email exists. Please log in or use different email');
        }
      }),

    //Password is required and must be a strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements'),
  ];
};
//Update Data Validation Rules
validate.updateRules = () => {
  return [
    //First is required and must be a string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'),

    //Last is required and must be a string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'),

    // valid email is required and cannot already exist in the database
    body('account_email')
      .trim()
      .notEmpty()
      .withMessage('Email address is required.')
      .isEmail()
      .withMessage('A valid email address is required.')
      .custom(async (email, { req }) => {
        if (email !== req.body.account_email_old) {
          const existingEmail = await accountModel.getAccountByEmail(email);
          if (existingEmail) {
            throw new Error('Email already in use.');
          }
        }
        return true;
      }),
  ];
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};
/* ******************************
 * Check data and return errors or continue to Update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/account-update/', {
      errors,
      title: 'Update',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

//Check password and return errors or continue to Update password
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/account-update/', {
      errors,
      title: 'Update',
      nav,
      account_password,
    });
    return;
  }
  next();
};

//Validate password rules
validate.updatePasswordRules = () => {
  return [
    //Password is required and must be a strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements'),
  ];
};
validate.loginRules = () => {
  return [
    //valid email is required and must not already exist in the database
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address.'),

    //Password is required and must be a strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements'),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });
    return;
  }
  next();
};
module.exports = validate;
