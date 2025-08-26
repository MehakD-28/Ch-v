const User = require("../models/user");

module.exports.signupForm = (req,res) => {
    res.render("../views/signup.ejs")
};

module.exports.signup = async (req,res) => {
    try{
        let {username,password,email} = req.body;
        let addUser = new User ({email,username});
        let newUser = await User.register(addUser ,password);
        console.log(newUser);
        req.login(newUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success" , `Welcome to Chàv  : ${username}`)
            res.redirect("/listings");
        }))
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginform = (req,res) => {
    res.render("../views/login.ejs")
};

module.exports.login = async (req,res) => {
    req.flash("success","Welcome Back to Chàv! ");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
};

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "successfully logged you out");
        res.redirect("/listings");
    });
};