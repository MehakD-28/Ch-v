const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });

//index route
router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.createlisting));

// new listing
router.get("/new",isLoggedIn, listingController.newRoute);


//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.editlisting));

//put request

router
    .route("/:id")
    .put( isLoggedIn,isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing))
    .get( wrapAsync( listingController.showlisting))
    .delete( isLoggedIn, isOwner,wrapAsync( listingController.deletelisting));

module.exports = router;