const utilities = require('.');
const invModel = require('../models/inventory-model');
const { body, validationResult } = require('express-validator');
const validate = {};

//Add classification Data validation Rules
validate.AddClassificationRules = () => {
  return [
    //Classification name is required and must be a strin
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
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      errors,
      title: 'Add New Classification',
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.inventoryRules = async (req, res, next) => {
  return [
    //Inv_make is required and must be a string
    body('inv_make')
      .trim()
      .escape()
      .isAlpha()
      .isLength({ min: 1 })
      .withMessage('Please provide a make.'),
    //inv_model is required and must be a string
    body('inv_model')
      .trim()
      .escape()
      .isAlpha()
      .isLength({ min: 1 })
      .withMessage('Please provide a model.'),
    //inv_year is required and must be a number
    body('inv_year')
      .trim()
      .escape()
      .isNumeric()
      .withMessage('Please provide a valid year.'),
    //inv_color is required and must be a string
    body('inv_color')
      .trim()
      .escape()
      .isAlpha()
      .isLength({ min: 1 })
      .withMessage('Please provide a color.'),
    //inv_miles is required and must be a number
    body('inv_miles')
      .trim()
      .escape()
      .isNumeric()
      .withMessage('Price value is missing')
      .withMessage('Please provide a number.'),
    //inv_description is required and must be a string
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
    res.render('inventory/addInventory', {
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
