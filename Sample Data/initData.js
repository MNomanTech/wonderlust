require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/Listing.js');
const {data} = require('./data.js');
let atlas_url = process.env.ATLAS_DB;
console.log(atlas_url);
// our database;
main()
.then(result => console.log("database is connected successfully..."))
.catch(err => console.log(err));




async function main() {
  await mongoose.connect(atlas_url);
};


async function initializingData(){
    await Listing.deleteMany({});
    await Listing.insertMany(data); 
    await Listing.updateMany({},{$set: {owner: "661d65dafe19be1367a25a68"}})
    console.log("data is inserted successfully");
};

initializingData();

