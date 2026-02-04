const express = require("express")
const router = express.Router()

// posts
//index route
router.get("/", (req, res) => {
    res.send(" hi posts i am posts index Shyama");
});

// shhow route
router.get("/:id", (req, res)=>{
    res.send(" hi posts i am show route")
})

// post route
router.post("/", (req, res)=>{
    res.send(" hi posts i am post route")
})
// delete route
router.delete("/:id", (req, res)=>{
    res.send("  hi posts posts i am delete route")
})

module.exports = router