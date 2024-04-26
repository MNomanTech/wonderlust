const Listing = require('./models/Listing.js');
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()) next();
    else{
        req.flash("error", "You need to Login first");
        req.session.redirectOriginalUrl = req.originalUrl;
        res.redirect("/login");
    }
};

// for listing
module.exports.isAuthorized = async (req,res,next) =>{

    
    let {id} = req.params;
    let user = await Listing.findById(id).populate("owner");
    
   
    if(req.user.equals(user.owner)) next();
    else{
        req.flash("error", "You don't have permission");
        res.redirect(`/listing/${id}`);
    }
};

// for reviews

module.exports.isAuthorizedReview =  async (req,res,next) => {
    let {id,rId} = req.params;
    let review = await Review.findById(rId).populate("createdBy");
    
    if(req.user.equals(review.createdBy)) next();
    else{
        req.flash("error", "permission denied");
        res.redirect(`/listing/${id}`);
    }
};