const express = require("express")

// Creating router object.
const router = express.Router()

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js")

//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
    //     4️⃣ Why the error happened (simple explanation)
    // Express looks inside views/ by default
    // You gave it an absolute path with /
    // Express tried to find:
    // views//listings/index.ejs
    // That failed → ❌ “Failed to lookup view”
}))

// Validation middleware.
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => (err.message).join(",")) // i made a change here
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}





//new listing form route ++
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

// CREATE RAOUTE ++
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    //WE HAVE TO WRITE THIS MANY TIME , IT IS NOT GOOD THATS WHY WE USE "JOI" FOR SERVER SIDE SCHEMA VALIDATION
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "search a valid route")
    // }

    // if(newListing.title){
    //     throw new ExpressError(400, "title is missing")
    // }
    // if(newListing.description){
    //     throw new ExpressError(400, "description is missing")
    // }
    // if(newListing.location){
    //     throw new ExpressError(400, "location is missing")
    // }
    // if(newListing.country){
    //     throw new ExpressError(400, "country is missing")
    // }
    // if(newListing.price){
    //     throw new ExpressError(400, "price is missing")
    // }
    // if(newListing.image){
    //     throw new ExpressError(400, "image is missing")
    // }


    // let result = listingSchema.validate(req.body)
    // console.log(result);
    // NO NEED OF THIS BECOZ THIS IS TAKING COMMAND NOW ::::::::::::::::::::: >  validateListing
    // if (result.error) { 

    // ::::::::::: FOR DIFFERENT ERROR DETAILS & +++++ change if to if(error)
    // let errMsg = error.details.map((el) => (err.message).join(","))
    // throw new ExpressError(400, error)


    //     throw new ExpressError(400, result.error)
    // }

    const newListing = new Listing(req.body.listing)
    await newListing.save()
    req.flash("success", "new listing created")
    res.redirect("/listings")


}))


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        throw new ExpressError(400, "search a valid route")
    }
    res.render("listings/edit.ejs", { listing })
}))


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))


//UPDATE ROUTE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    console.log(req.body.listing.image);
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}))

//delete route

router.delete("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings")
}))

module.exports = router