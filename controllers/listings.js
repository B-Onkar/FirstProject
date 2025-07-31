const Listing = require("../models/listing");

// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    return res.render("listings/index.ejs", {allListings})
}

// New Route
module.exports.newListingForm = (req, res) => {
    return res.render("listings/new.ejs")
}

// Show Route
module.exports.showListing = async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner")
    if (!listing) {
        req.flash("error", "Listing not found!")
        return res.redirect("/listings")
    }
    return res.render("listings/show.ejs", {listing})
}

// Create Route
module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, country, location}
    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id // Set the owner to the currently logged-in user
    newListing.image = { url, filename } // Set the image URL and filename
    await newListing.save()
    req.flash("success", "Successfully created listing!")
    res.redirect("/listings")
}

// Edit Route
module.exports.editListingForm = async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing not found!")
        return res.redirect("/listings")
    }
    return res.render("listings/edit.ejs", {listing})
}

// Update Route
module.exports.updateListing = async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    req.flash("success", "Successfully updated listing!")
    return res.redirect(`/listings/${id}`)
}

// Delete Route
module.exports.deleteListing = async (req, res) => {
    let {id} = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Successfully deleted listing!")
    return res.redirect("/listings")
}