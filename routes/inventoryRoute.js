// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');

router.get('/', utilities.handleErrors(invController.buildManagementView));
// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

//Route to build car specicifications view
router.get(
  '/detail/:invId',
  utilities.handleErrors(invController.buildByInventoryId)
);

//classification management view
router.get(
  '/add-classification',
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  '/add-classification',
  invValidate.AddClassificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

//Inventory management view
router.get(
  '/add-inventory',
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  '/add-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);
module.exports = router;
