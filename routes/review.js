const express = require("express")

// Creating router object.
const router = express.Router({mergeParams: true}) // In ap.JS. :ID stops. To make its natural flow, we use "mergeParams:true".

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")


//Review-------------------------------------------------------------------------------rev
// Validation middleware. For review.
const validateReview = (req, res, next)=>{
    let { error } = reviewSchema.validate(req.body)
    
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}
// post route
router.post("/", validateReview , wrapAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()

    // console.log("new rev saved");
    // res.send("new rev saved");

    res.redirect(`/listings/${listing._id}`)
    
}))

//DELETE REVIEW ROUTE

router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} =req.params

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}`)
}))

module.exports =router