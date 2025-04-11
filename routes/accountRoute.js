//Needed resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation');

//Build the account management view

router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
);

// Route to build the login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

/* Deliver Registration route*/
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

/*Process the registration data*/
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  '/logout',
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountLogout)
);
//account update route
router.get(
  '/update/:accountId',
  utilities.handleErrors(accountController.buildAccountUpdate)
);
router.post(
  '/update',
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  '/update-password',
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
