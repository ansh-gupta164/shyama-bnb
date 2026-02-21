
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
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
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash")  //+ connect-flash npm package 
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const { date } = require("joi")
const { serialize } = require("v8")


require('dotenv').config() 

const dbUrl = process.env.ATLASDB_URL


main()
.then(() => {
    console.log("connected to DB Nikunj");
    
}).catch((err) => {
    console.log(err);
    
})

async function main() {
    await mongoose.connect(dbUrl)

}

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crpto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 // For lazy update.
})

store.on("error", () => {
    log("error in mongo store", err)
})

// * session
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000, //day * hr * min * sec * ms
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }

}


//* mw For session 
app.use(session(sessionOption))
// flash should come after session mw
app.use(flash()) 

// use passport methods after session and flash 
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// after flash , before routes, * Express provides a res.locals.
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


//root
app.get("/", (req, res) => {
    res.redirect("/listings")
});

//routes 
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)


app.get("/demoUser", async (req, res) => {
    let fakeUser = new User({
        email: "a@gmail.com",
        username: "demo1"
    })
    let registeredUser = await User.register(fakeUser, "@a")
    res.send(registeredUser)
})



// If any route don't match then this will run. This will match.
// 404 handler (catch-all)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// CUSTOM ERRRO HANDLER ++++++++++++++++++++++++++
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong " } = err
    
    res.status(statusCode).render("error.ejs", { message })
})

app.listen(3000, () => {
    console.log("server is listening at port 3000");

})
