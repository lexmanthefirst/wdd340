// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

//Route to build car specicifications view
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId)
);

module.exports = router;
