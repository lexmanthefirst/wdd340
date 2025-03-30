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
    res.render('inventory/addClassification', {
      title: 'Add New Classification',
      errors: null,
      nav,
      classification_name,
    });
  }
};

//Add single invtory
invCont.addInventory = async function (res, req, next) {
  const nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    classification_id,
    inv_color,
    inv_miles,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
  } = req.body;
  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    classification_id,
    inv_color,
    inv_miles,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price
  );
  if (response) {
    req.flash(
      'notice',
      `The ${inv_make} ${inv_model} has been successfuly added.`
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
module.exports = invCont;
