const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by single vehicle view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  const vehicleYear = data[0].inv_year;
  // view -- vehicle.ejs
  res.render('./inventory/vehicle', {
    title: vehicleYear + ' ' + vehicleMake + ' ' + vehicleModel,
    nav,
    grid,
    errors: null,
  });
};

/*** Build management view */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const selectClassification = await utilities.buildClassificationList();
  res.render('inventory/management', {
    title: 'Vehicle Management',
    errors: null,
    nav,
    selectClassification,
  });
};

//Build the add classification view

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    errors: null,
  });
};

//Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render('inventory/add-inventory', {
    title: 'Add Vehicle',
    errors: null,
    nav,
    classifications,
  });
};

//Build the add classification
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model...
  let nav = await utilities.getNav(); // After query, so it shows new classification
  if (response) {
    req.flash(
      'notice',
      `The "${classification_name}" classification was successfully added.`
    );
    res.render('inventory/management', {
      title: 'Vehicle Management',
      errors: null,
      nav,
      classification_name,
    });
  } else {
    req.flash('notice', `Failed to add ${classification_name}`);
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      errors: null,
      nav,
      classification_name,
    });
  }
};

//Add single invtory
//Add single inventory
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      'notice',
      `The ${inv_make} ${inv_model} has been successfully added.`
    );
    const selectClassification = await utilities.buildClassificationList(
      classification_id
    );
    res.render('inventory/management', {
      title: 'Vehicle Management',
      errors: null,
      nav,
      selectClassification,
    });
  } else {
    req.flash('notice', `Failed to add ${inv_make} ${inv_model}`);
    res.render('inventory/add-inventory', {
      title: 'Add Vehicle',
      errors: null,
      nav,
      classifications: await utilities.buildClassificationList(),
    });
  }
};

//Build the edit inventory view
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);
  const data = await invModel.getInventoryByInvId(inv_id);
  const classifications = await utilities.buildClassificationList();
  const nav = await utilities.getNav();
  res.render('inventory/edit-inventory', {
    title: 'Edit Vehicle',
    errors: null,
    nav,
    classifications,
    data,
  });
};
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No inventory found for this classification'));
  }
};

// //Build the edit inventory view
// invCont.buildAddInventory = async function (req, res, next) {
//   const inv_id = parseInt(req.params.inventoryId);
//   const nav = await utilities.getNav();

//   const inventoryData = (await invModel.getInventoryByInvId(inv_id))[0];
//   const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

//   let classifications = await utilities.buildClassificationList(
//     inventoryData.classification_id
//   );

//   res.render('inventory/edit-inventory', {
//     title: 'Edit ' + name,
//     errors: null,
//     nav,
//     classifications,
//     inv_id: inventoryData.inv_id,
//     inv_make: inventoryData.inv_make,
//     inv_model: inventoryData.inv_model,
//     inv_year: inventoryData.inv_year,
//     inv_description: inventoryData.inv_description,
//     inv_image: inventoryData.inv_image,
//     inv_thumbnail: inventoryData.inv_thumbnail,
//     inv_price: inventoryData.inv_price,
//     inv_miles: inventoryData.inv_miles,
//     inv_color: inventoryData.inv_color,
//     classification_id: inventoryData.classification_id,
//   });
// };

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render('./inventory/edit-inventory', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};
module.exports = invCont;
