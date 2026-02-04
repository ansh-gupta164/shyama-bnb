const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")  //# cookie-parser npm package
const session = require("express-session")  //* express-session npm package 
const flash = require("connect-flash")  //+ connect-flash npm package 
const path = require("path")

const users = require("./routes/user.js")
const posts = require("./routes/post.js")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(cookieParser())  //#mw
app.use(cookieParser("secretcode"))  //#mw For signed cookie.



const sessionOption = {
    secret: "mysuperstringsecret",
    resave: false,
    saveUninitialized: true

}

//* mw For session .
app.use(session(sessionOption))

app.use(flash()) //+ mw

//should be after flash() mw  , better way 

app.use((req, res, next)=>{
    res.locals.errorMsg = req.flash("error") 
    res.locals.Message = req.flash("success")
    next()
})


app.get("/test", (req, res) => {
    res.send("success")
})

app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++
    } else {
        req.session.count = 1;
    }
    res.send(`you requested ${req.session.count} times`)
})

app.get("/register", (req, res) => {
    /* Search  /register and pass the name in query string 
    then it will redirect you to the /hello page where you can get your name.*/
    let { name = "anonymous" } = req.query
    req.session.name = name

    if(name === "anonymous"){
        req.flash("error", "some error occured")
    }else{
        req.flash("success", "user registered succussfully")
    }

    // flash is only declared. here we are not showing falsh , 
    // To show use view engine(folder views , .ejs=> pass variables) and path
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    // res.send(`hello ${req.session.name}`)
    // console.log(req.flash("success"));

    // errorMsg is a variable we can pass it directly to ejs no need to pass in render line 
    res.render("page.ejs", { name: req.session.name, /*msg:req.flash("success")*/ })
    // For doing this we have to add view engine and path.

})



app.get("/getsc", (req, res) => {
    res.cookie("na", "radh", { signed: true })
    res.send(" signed Cookies set successfully")
});

app.get("/", (req, res) => {
    console.dir(req.cookies)
    res.send("  hi i am root Shyama");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies)
    res.send("  verified c");
});

app.get("/getc", (req, res) => {
    res.cookie("name", "radha")
    res.cookie("madeinindia", "india")
    res.send(" Cookies set successfully")
});

app.get("/greet", (req, res) => {
    let { name = "Mohan" } = req.cookies
    res.send(`hi ${name}`);
});

app.use("/users", users)
app.use("/posts", posts)











app.listen(3000, () => {
    console.log("server is listening at port 3000");

})


