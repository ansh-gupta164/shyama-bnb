const express = require("express")
const router = express.Router()

// user
//index route -user
router.get("/", (req, res) => {
    res.send("Hi i am user index Shyama");
});

// shhow route -user
router.get("/:id", (req, res)=>{
    res.send("hi i am show route")
})


// post route -user
router.post("/", (req, res)=>{
    res.send("hi i am post route")
})
// delete route -user
router.delete("/:id", (req, res)=>{
    res.send("hi i am delete route")
})

module.exports = router;