const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError")
const {listingSchema, reviewSchema} = require("./schema")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available in the response locals
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to edit this listing!")
        return res.redirect(`/listings/${id}`) // Redirect if the user is not the owner
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if (error) {
        let msg = error.details.map(el => el.message).join(", ")
        throw new ExpressError(400, msg)
    }
    else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body) // Assuming reviewSchema is defined in schema.js
    if (error) {
        let msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}