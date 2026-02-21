const Listing = require("../models/listing")

//home page
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    let url = req.file.path

    let filename = req.file.filenameF
    console.log(req.user._id);
    newListing.image = { url, filename }
    let listing = await newListing.save()

    if (typeof (req.file) != "undefined") {
        url = req.file.path
        filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()
    }
    req.flash("success", "new listing created")
    res.redirect("/listings")
}

//new form
module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs")
}

//show listing
module.exports.showListings = async (req, res) => {
    let { id } = req.params
    const listing = await Listing
        .findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
    console.log(listing);
    res.render("listings/show.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    console.log(req.body.listing.image);
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        throw new ExpressError(400, "search a valid route")
    }

    let originalUrl = listing.image.url
    originalUrl = originalUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalUrl })
}

