const User = require('../models/user');


module.exports.getSignUp = (req,res) => {
    res.render("listing/signup.ejs");
};
module.exports.postSignUp = async (req,res,next) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({
            email: email,
            username: username,
        });

        let registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err)=>{
            if(err) next();
            req.flash("success", "Welcome to Wonderlust");
            res.redirect('/listing');
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
};
module.exports.getLogin = (req,res) => {
    
    res.render('listing/login.ejs');
    
};
module.exports.postLogin = (req,res) => {
    req.flash("success", "Welcome back to Wonderlust");
    
    res.redirect(res.locals.redirectOriginalUrl);
};
module.exports.getLogout = (req,res,next) => {
    req.logout((err) => {
        if(err) next(err);
        else{
            req.flash("success", "Successfully logout!");
            
            res.redirect('/listing');
        }
    });
};