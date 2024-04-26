const express = require("express");
const router = express.Router({mergeParams: true});
const Listing= require('../models/Listing.js');
const Review = require('../models/review.js');
const reviewValidationSchema = require('../SchemaValidation/reviewValidationSchema.js');
const {isLoggedIn , isAuthorizedReview} = require('../middleware.js');
const reivewController = require('../controllers/review.js');

let validationReviewSchema = (req,res,next) => {
    let {error} = reviewValidationSchema.validate(req.body);

    if(error)   throw new ExpressError(400, error);

    next();
}

// for reviews
router.post('/' , isLoggedIn, validationReviewSchema , reivewController.createReview);

// delete review 
router.delete('/:rId', isLoggedIn, isAuthorizedReview,  reivewController.destroyReview);

module.exports = router;