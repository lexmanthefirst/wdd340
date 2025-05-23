const utilities = require('../utilities');
const invModel = require('../models/inventory-model');
const { body, validationResult } = require('express-validator');
const validate = {};

//Add classification Data validation Rules
validate.AddClassificationRules = () => {
  return [
    //Classification name is required and must be a string
    body('classification_name')
      .trim()
      .escape()
      .isAlphanumeric()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a classification name.'),
  ];
};
//Add classification Data validation Rules
validate.deleteClassificationRules = () => {
  return [
    //Classification name is required and must be a string
    body('classification_name')
      .trim()
      .escape()
      .isAlphanumeric()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a classification name.'),
  ];
};

//Check data amd return errors or proceed with add classification

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      // Try again
      errors,
      title: 'Add Classification',
      nav,
      classification_name,
    });
    return;
  }
  next();
};
//Check data amd return errors or proceed with delete classification

validate.checkDeleteClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/delete-classification', {
      // Try again
      errors,
      title: 'Delete Classification',
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.inventoryRules = () => {
  return [
    // Make is required and must be string
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Make value is missing')
      .isLength({ min: 1 })
      .withMessage('Please provide a make.'), // on error this message is sent.

    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a model.'),

    body('inv_year')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Year value missing.')
      .isNumeric()
      .withMessage('Year must be a number.'),

    body('inv_description')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a description.'),

    body('inv_image')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an image.'),

    body('inv_thumbnail')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a thumbnail.'),

    body('inv_price')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Price value is missing.')
      .isNumeric()
      .withMessage('Price must be a number.'),

    body('inv_miles')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Miles value is missing.')
      .isNumeric()
      .withMessage('Miles must be a number.'),

    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a color.'),

    body('classification_id')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage('Please provide a make.'),
  ];
};
validate.updateInventoryRules = () => {
  return [
    // Make is required and must be string
    body('inv_make')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Make value is missing')
      .isLength({ min: 1 })
      .withMessage('Please provide a make.'), // on error this message is sent.

    body('inv_model')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a model.'),

    body('inv_year')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Year value missing.')
      .isNumeric()
      .withMessage('Year must be a number.'),

    body('inv_description')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a description.'),

    body('inv_image')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an image.'),

    body('inv_thumbnail')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a thumbnail.'),

    body('inv_price')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Price value is missing.')
      .isNumeric()
      .withMessage('Price must be a number.'),

    body('inv_miles')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Miles value is missing.')
      .isNumeric()
      .withMessage('Miles must be a number.'),

    body('inv_color')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a color.'),

    body('classification_id')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage('Please provide a make.'),
  ];
};

//Check data and return errors or proceed with add inventory registration
validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
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
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render('inventory/add-inventory', {
      // Try again
      errors,
      title: 'Add Inventory',
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};
//Check data and return errors or proceed with edit inventory update
validate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
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
      inv_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render('inventory/edit-inventory', {
      // Try again
      errors,
      title: 'Update Inventory',
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};
module.exports = validate;
