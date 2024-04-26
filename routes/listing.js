const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing.js');
const ExpressError = require('../utils/expressError.js');
const multer  = require('multer');
const {storage} = require('../CloudConfig.js');
const upload = multer({storage}); 

const ListingSchemaValidation = require('../SchemaValidation/listingSchema');
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn , isAuthorized } = require("../middleware.js");

const listingController = require('../controllers/listing.js');

let validationListingSchema = (req,res,next) => {

    let {error} = ListingSchemaValidation.validate(req.body);

    if(error) {
        throw new ExpressError(400, error);
    }

    next();
};


// index route // submit created route
router.route('/')
.get( wrapAsync( listingController.index ))
.post( isLoggedIn , upload.single('Listing[image]'), validationListingSchema,  wrapAsync( listingController.submitCreatedRoute));
// .post( upload.single('Listing[image]'), validationListingSchema,  wrapAsync( listingController.submitCreatedRoute));

// create new route
router.get('/new', isLoggedIn ,listingController.newRoute);
// router.get('/new', listingController.newRoute);

// show route // update Form route // delete listing route
router.route('/:id')
.get( wrapAsync(listingController.showRoute))
.put( isLoggedIn ,isAuthorized,  upload.single('Listing[image]'), validationListingSchema ,wrapAsync(listingController.updateRoute))
.delete( isLoggedIn , isAuthorized, wrapAsync(listingController.destroyRoute));

// Edit Form route
router.get('/:id/edit', isLoggedIn , isAuthorized, wrapAsync(listingController.editRoute));

module.exports = router;