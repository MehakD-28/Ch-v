const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError= require("./util/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please sign in!!");
        return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let newlist = await Listing.findById(id);
    if (!newlist.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permisiion.");
         return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let { error }= listingSchema.validate(req.body);
    if( error ){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReviews = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    let newreview = await Review.findById(reviewId);
    if (!newreview.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permisiion.");
         return res.redirect(`/listings/${id}`);
    }
    next();
};
