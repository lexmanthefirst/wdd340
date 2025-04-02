const express = require('express');
const router = express.Router();
const intentionalErrorController = require('../controllers/intentionalErrorController');
const utilities = require('../utilities');

router.get('/', utilities.handleErrors(intentionalErrorController.causeError));

module.exports = router;
