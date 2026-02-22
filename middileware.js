
const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }

        console.log("Auth:", req.isAuthenticated()); //
        console.log("User:", req.user); //

        req.flash("error", "please log in")
        return res.redirect("/login")
    }
    next()
}

// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.redirectUrl = req.originalUrl;   // save redirect here

//         console.log("Saving redirect URL:", req.originalUrl);   // ADD THIS
//         console.log("Session now:", req.session);               // ADD THIS

//         req.flash("error", "Please log in first.");
//         return res.redirect("/login");
//     }
//     next();
// };

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "you are not owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => (err.message).join(",")) // i made a change here
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {

    let { id, reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not author of the review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}