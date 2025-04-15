// Needed resources
const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');
const reviewValidate = require('../utilities/review-validation');

// All review routes require login
router.use(utilities.checkLogin);

// Build review form view
router.get(
  '/review/:inv_id',
  utilities.handleErrors(reviewController.buildReviewForm)
);

// Process adding a new review
router.post(
  '/review',
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Build edit review form
router.get(
  '/review/edit/:review_id',
  utilities.handleErrors(reviewController.buildEditReviewForm)
);

// Process updating a review
router.post(
  '/review/update',
  reviewValidate.reviewRules(),
  reviewValidate.checkUpdateReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Process deleting a review
router.get(
  '/review/delete/:review_id',
  utilities.handleErrors(reviewController.deleteReview)
);

// Build user's reviews view
router.get(
  '/reviews',
  utilities.handleErrors(reviewController.buildUserReviewsView)
);

module.exports = router;
