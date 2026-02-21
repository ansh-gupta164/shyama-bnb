const User = require("../models/user")

// signupForm
module.exports.signupForm = async (req, res) => {
    res.render("users/signup.ejs")
}

// signup
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        console.log(req.body);

        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);

        // For auto login after sign up. Hey, Cortana.
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }

}

//login form
module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs")
}

//login
module.exports.login = async (req, res) => {
    req.flash("success", "welcome to Nikunj")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    // console.log("Redirecting to:", redirectUrl);

    res.redirect(redirectUrl)

}

// logout
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Log Out Successfully")
        res.redirect("/listings")
    })
}



