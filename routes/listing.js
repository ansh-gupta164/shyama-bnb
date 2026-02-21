const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middileware.js")
const listingController = require("../controllers/listings.js")
const { storage } = require("../cloudConfig.js")
const multer = require("multer")
const upload = multer({ storage })

//index route & create listing
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))

// New route should be above ID route.
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show , update and delete listing
router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router