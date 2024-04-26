const Listing = require('../models/Listing.js');
const {cloudinary} = require('../CloudConfig.js');
const mbxTilesets = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxTilesets({ accessToken: process.env.MAP_TOKEN });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.

// index route

module.exports.index = async (req,res) => {
    
    const allList = await Listing.find();
    
    res.render("listing/index.ejs" , { allList });

};


// create new route
module.exports.newRoute = (req,res) => {
    
    res.render('listing/newRoute.ejs');
};

// show route
module.exports.showRoute = async (req,res) => {

    let {id} = req.params;
    let listItem = await Listing.findById(id).populate({path: "reviews", populate: {path: "createdBy"}}).populate("owner","username");
    
    if(listItem)
        {                        
            res.render('listing/ShowRoute.ejs', {listItem});
        }
    else{
        req.flash("error", "No listing is present");
        res.redirect('/listing');
    }
};

// submit created route
module.exports.submitCreatedRoute = async (req,res) => {
    const {Listing: newList} = req.body;
    let {path: url,filename} = req.file;

    let response = await geocodingClient.forwardGeocode({
        query: newList.location,
        limit: 1
      })
      .send();
        
    newList.image = {url,filename};
    newList.owner = req.user["_id"];
    newList.geometry = response.body.features[0].geometry;
    let savedList  = await new Listing(newList).save();
    
    req.flash("success", "New Listing is Created Successfully!");
    res.redirect('/listing');
    
};

// edit form route get method 
module.exports.editRoute = async (req,res) => {
    const listItem = await Listing.findById(req.params["id"]);
    
    if(listItem)
        {
                        
            res.render('listing/editRoute.ejs', { listItem });
        }
    else{
        req.flash("error", "No listing is present");
        res.redirect('/listing');
    }

    
};

// update form route put method
module.exports.updateRoute = async (req, res) => {

    const {id} = req.params;
    
    if (typeof req.file == "undefined") {
        await Listing.findByIdAndUpdate(id, { ... req.body["Listing"] } , {runValidators: true});
    } else {
        let {path: url} = req.file;
        await Listing.findByIdAndUpdate(id, { ... req.body["Listing"] , "image.url": url } , {runValidators: true});
    }
    
    req.flash("success", "Listing Edited Successfully!");
    res.redirect(`/listing/${id}`);
};

// delete listing route
module.exports.destroyRoute = async (req,res) => {
    const {id} = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted Successfully!");
    res.redirect('/listing');
};