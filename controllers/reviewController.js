const utilities = require('../utilities/');
const reviewModel = require('../models/review-model');
const invModel = require('../models/inventory-model');

/* ***************************
 *  Build review form view
 * ************************** */
async function buildReviewForm(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const account_id = res.locals.accountData.account_id;

  try {
    // Get inventory details
    const invData = await invModel.getInventoryByInvId(inv_id);
    if (!invData || invData.length === 0) {
      req.flash('notice', 'Vehicle not found.');
      return res.redirect('/inv/');
    }

    const vehicle = invData[0];
    const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;

    // Check if user has already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(
      inv_id,
      account_id
    );

    let nav = await utilities.getNav();
    res.render('inventory/review-form', {
      title: `Review ${vehicleName}`,
      nav,
      errors: null,
      inv_id,
      vehicleName,
      existingReview,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Process adding a new review
 * ************************** */
async function addReview(req, res, next) {
  const { inv_id, review_text, review_rating } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    // Check if user has already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(
      inv_id,
      account_id
    );
    if (existingReview) {
      req.flash('notice', 'You have already reviewed this vehicle.');
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // Add the review
    const result = await reviewModel.addReview(
      inv_id,
      account_id,
      review_text,
      review_rating
    );

    if (result) {
      req.flash('notice', 'Your review has been added successfully.');
      return res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash('notice', 'Sorry, there was an error adding your review.');
      return res.redirect(`/inv/review/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build edit review form
 * ************************** */
async function buildEditReviewForm(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  const account_id = res.locals.accountData.account_id;

  try {
    // Get review details
    const review = await reviewModel.getReviewById(review_id);

    // Check if review exists and belongs to the current user
    if (!review || review.account_id !== account_id) {
      req.flash(
        'notice',
        'Review not found or you do not have permission to edit it.'
      );
      return res.redirect('/account/reviews');
    }

    let nav = await utilities.getNav();
    res.render('inventory/edit-review', {
      title: `Edit Review for ${review.inv_year} ${review.inv_make} ${review.inv_model}`,
      nav,
      errors: null,
      review,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Process updating a review
 * ************************** */
async function updateReview(req, res, next) {
  const { review_id, review_text, review_rating } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    // Get review details to check ownership
    const review = await reviewModel.getReviewById(review_id);

    // Check if review exists and belongs to the current user
    if (!review || review.account_id !== account_id) {
      req.flash(
        'notice',
        'Review not found or you do not have permission to edit it.'
      );
      return res.redirect('/account/reviews');
    }

    // Update the review
    const result = await reviewModel.updateReview(
      review_id,
      review_text,
      review_rating
    );

    if (result) {
      req.flash('notice', 'Your review has been updated successfully.');
      return res.redirect(`/inv/detail/${review.inv_id}`);
    } else {
      req.flash('notice', 'Sorry, there was an error updating your review.');
      return res.redirect(`/inv/review/edit/${review_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Process deleting a review
 * ************************** */
async function deleteReview(req, res, next) {
  const review_id = parseInt(req.params.review_id);
  const account_id = res.locals.accountData.account_id;

  try {
    // Get review details to check ownership
    const review = await reviewModel.getReviewById(review_id);

    // Check if review exists and belongs to the current user
    if (!review || review.account_id !== account_id) {
      req.flash(
        'notice',
        'Review not found or you do not have permission to delete it.'
      );
      return res.redirect('/account/reviews');
    }

    // Delete the review
    const result = await reviewModel.deleteReview(review_id);

    if (result) {
      req.flash('notice', 'Your review has been deleted successfully.');
      return res.redirect(`/inv/detail/${review.inv_id}`);
    } else {
      req.flash('notice', 'Sorry, there was an error deleting your review.');
      return res.redirect('/account/reviews');
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build user's reviews view
 * ************************** */
async function buildUserReviewsView(req, res, next) {
  const account_id = res.locals.accountData.account_id;

  try {
    // Get all reviews by the user
    const reviews = await reviewModel.getReviewsByAccountId(account_id);

    let nav = await utilities.getNav();
    res.render('account/reviews', {
      title: 'My Reviews',
      nav,
      errors: null,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildReviewForm,
  addReview,
  buildEditReviewForm,
  updateReview,
  deleteReview,
  buildUserReviewsView,
};
