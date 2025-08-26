const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapsync.js");
const {isLoggedIn, validateReviews, isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



//reviews
//Post Route
router.post("/", isLoggedIn,validateReviews,  wrapAsync( reviewController.postReview));

//delete review
router.delete("/:reviewId",  isLoggedIn, isAuthor, wrapAsync ( reviewController.deleteReview));

module.exports = router;