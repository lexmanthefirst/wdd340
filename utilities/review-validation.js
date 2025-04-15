const utilities = require('../utilities');
const { body, validationResult } = require('express-validator');
const validate = {};

// Review Data Validation Rules
validate.reviewRules = () => {
  return [
    // Review text is required and must be a string
    body('review_text')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Review text must be between 10 and 1000 characters.'),

    // Rating is required and must be a number between 1 and 5
    body('review_rating')
      .trim()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be a number between 1 and 5.'),
  ];
};

// Check data and return errors or continue to add review
validate.checkReviewData = async (req, res, next) => {
  const { review_text, review_rating } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/review-form', {
      errors,
      title: 'Add Review',
      nav,
      review_text,
      review_rating,
      inv_id: req.body.inv_id,
      vehicleName: req.body.vehicleName,
    });
    return;
  }
  next();
};

// Check data and return errors or continue to update review
validate.checkUpdateReviewData = async (req, res, next) => {
  const { review_text, review_rating } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/edit-review', {
      errors,
      title: 'Edit Review',
      nav,
      review_text,
      review_rating,
      review: req.body.review,
    });
    return;
  }
  next();
};

module.exports = validate;
