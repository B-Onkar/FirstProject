const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")

const usersController = require("../controllers/users.js")
const user = require("../models/user.js")

router.route("/signup")
.get(wrapAsync(usersController.signupForm)) // Routes for user authentication
.post(wrapAsync(usersController.signup)) // Handle user signup

router.route("/login")
.get(wrapAsync(usersController.loginForm)) // Render the login form
.post(saveRedirectUrl, passport.authenticate("local", { successRedirect: "/listings", failureRedirect: "/login", failureFlash: true}), usersController.login) // Handle user login

router.get("/logout", usersController.logout)

module.exports = router