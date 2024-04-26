const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const userController = require('../controllers/user');

let saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectOriginalUrl) res.locals.redirectOriginalUrl = req.session.redirectOriginalUrl;
    next();
};

router.route('/signup')
.get( userController.getSignUp)
.post( wrapAsync( userController.postSignUp));


router.route('/login')
.get( userController.getLogin)
.post( saveRedirectUrl, passport.authenticate('local',{failureRedirect: '/login' , failureFlash: true}), userController.postLogin);

router.get('/logout' , userController.getLogout);

module.exports = router;