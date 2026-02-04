const express = require("express")
const app = express()
const mongoose = require("mongoose")

const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")

const session = require("express-session")  //* express-session npm package 
const flash = require("connect-flash")  //+ connect-flash npm package 

const listing = require("./routes/listing.js")
const review = require("./routes/review.js")
const { date } = require("joi")

const MongoUrl = 'mongodb://127.0.0.1:27017/shyama'

main()
    .then(() => {
        console.log("connected to DB shyama");

    }).catch((err) => {
        console.log(err);

    })

async function main() {
    await mongoose.connect(MongoUrl)

}

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// * session
const sessionOption = {
    secret: "mysuperstringsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000, //day * hr * min * sec * ms
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }

}


//* mw For session .
app.use(session(sessionOption))

// flash should come after session mw
app.use(flash()) //+ mw
// flash should be used before these routes.

// after flash , before routes, * Express provides a res.locals.
app.use((req, res, next)=>{
    res.locals.success = req.flash("success")
    next()
})


//root
app.get("/", (req, res) => {
    res.redirect("/listings")
});


app.use("/listings", listing)
app.use("/listings/:id/reviews", review)

// If any route don't match then this will run. This will match.
// 404 handler (catch-all)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// CUSTOM ERRRO HANDLER ++++++++++++++++++++++++++
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong radheVALLABH" } = err
    res.status(statusCode).render("error.ejs", { message })
})

app.listen(3000, () => {
    console.log("server is listening at port 3000");

})

















// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My Home Villa",
//         description: "river facing",
//         price: 1200,
//         location: "omkareshwar , mp",
//         country: "india",
//     })

//     await sampleListing.save()
//     console.log("sample saved");
//     res.send("successful testing")

// })