const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingsController = require("../controllers/listings.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js") // Import cloudinary storage configuration
const upload = multer({ storage }) // Configure multer for file uploads

router.route("/")
.get(wrapAsync(listingsController.index)) // Index Route 
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingsController.createListing)) // Create Route

// New Route
router.get("/new", isLoggedIn, listingsController.newListingForm)

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.editListingForm))

router.route("/:id")
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.updateListing)) // Update Route
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing)) // Delete Route
.get(wrapAsync(listingsController.showListing)) // Show Route

module.exports = router