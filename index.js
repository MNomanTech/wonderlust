if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
};


const express = require("express");
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
// const MongoStore = require('connect-mongo');

let atlas_url = process.env.ATLAS_DB;



// middle wares;
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'/public')));
app.engine('ejs', ejsMate);

app.use(cookieParser("secret"));

// let store = MongoStore.create({
//     mongoUrl: "mongodb+srv://mohammednoman757:8Cx4XZQ0EhXoeuCV@cluster0.8humh4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//     crypto: {
//         secret: "MySecretCode",
//       },
//     touchAfter: 24 * 3600,
//   });

// store.on("error", (err)=> {
//     console.log("error in mongo session store", err);
// });
app.use(session({
   
    secret: process.env.SECRET, 
    resave: false , 
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
    // store: MongoStore.create({
    //     mongoUrl: 'mongodb://127.0.0.1:27017/wonderlust',
    //     touchAfter: 24 * 3600 // time period in seconds
    //   }),
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// our database;

main()
.then(result => console.log("database is connected successfully..."))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(atlas_url);
};

// our server
app.listen(8080, ()=>{
    console.log("server is working at 8080 port");
});



// middle ware for all routes
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.redirectOriginalUrl = '/listing';
    next();
});


//routes 
app.use('/listing', listingsRouter);
app.use('/listing/:id/reviews', reviewsRouter);
app.use('/',userRouter);

app.all('*', (req,res,next) => {
    next(new ExpressError(404,"Page Not Found"));
});

// error middleWares
app.use((err,req,res,next) => {
    let {statusCode = 500 , message = "Error occured at this point"} = err;
    
    res.status(statusCode).render('listing/error.ejs', {message});
    
});

