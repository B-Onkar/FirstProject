const User = require("../models/user") // Import the User model

// signUp
module.exports.signupForm = (req, res) => {
    return res.render("users/signup.ejs") // Render the signup page
}

// Handle user signup
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ username, email })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Wanderlust!")
            return res.redirect("/listings") // Redirect to listings after signup
        })
    } catch (e) {
        req.flash("error", e.message)
        return res.redirect("/signup")
    }
}

// Render the login form
module.exports.loginForm = (req, res) => {
    return res.render("users/login.ejs") // Render the login page
}

// Handle user login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!")
    return res.redirect(req.locals.redirectUrl || "/listings") // Redirect to listings after login
}

// Handle user logout
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged out successfully!")
        return res.redirect("/listings") // Redirect to listings after logout
    })
}