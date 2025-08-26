const express = require("express");
const router = express.Router();
const wrapsync = require("../util/wrapsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


router
.route("/signup")
.get(userController.signupForm )
.post(wrapsync(userController.signup));

router
.route("/login")
.get( userController.loginform)
.post( saveRedirectUrl, passport.authenticate('local' , {failureRedirect: "/login", failureFlash: true }) , wrapsync(userController.login));

router.get("/logout", userController.logout);


module.exports = router;