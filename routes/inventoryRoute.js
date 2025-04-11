// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');

router.use(
  [
    '/add-inventory',
    '/add-classification',
    '/edit/:inv_id',
    '/delete/:inv_id',
    'update',
    '/delete/',
  ],
  utilities.checkAuthorization
);
router.get(
  '/',
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildManagementView)
);
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
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
); // ...through the appropriate router, where server-side validation middleware is present,...

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

// Build edit/update inventory views
router.get(
  '/edit/:inv_id',
  utilities.handleErrors(invController.buildEditInventory)
);
//AJAX inventory api call to get inventory by classification_id
// This route is used to fetch the inventory data for a specific classification_id
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

router.post(
  '/update',
  invValidate.updateInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//Delete router inventory
router.get(
  '/delete/:inv_id',
  utilities.handleErrors(invController.buildDeleteInventory)
);
router.post('/delete/', utilities.handleErrors(invController.deleteInventory));

module.exports = router;
