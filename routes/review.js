const express = require("express")
const router = express.Router({ mergeParams: true }) // In app.js. :ID stops. To make its natural flow, we use "mergeParams:true".
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middileware.js")
const reviewController = require("../controllers/reviews.js")

// post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router