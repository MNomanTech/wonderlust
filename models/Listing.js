const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    discription: String,
    image: {
       url: String,
       filename: String,
    },
    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
});


// middelware for findByIdAndDelete
listingSchema.post('findOneAndDelete', async function(listItem) {
    
    let result = await Review.deleteMany({_id: {$in: listItem.reviews}});
    
});


const Listing = mongoose.model('Listing',listingSchema);



module.exports = Listing;