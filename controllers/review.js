const Listing= require('../models/Listing.js');
const Review = require('../models/review.js');

// creating new review
module.exports.createReview = async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
   
    let review = new Review(req.body["review"]);
    review.createdBy = req.user["_id"];
    listing.reviews.push(review);
    
    await listing.save();
    await review.save();

    req.flash("success", "New Review is Created");

    res.redirect(`/listing/${listing["_id"]}`);
    
};

// for deleting review
module.exports.destroyReview = async (req,res) => {
    let {id,rId} = req.params;
    await Listing.updateOne({_id: id}, {$pull: {reviews: rId}});
    await Review.deleteOne({_id: rId});
 
    req.flash("success", "Review is Deleted Successfully!");
 
    res.redirect(`/listing/${id}`);
 };