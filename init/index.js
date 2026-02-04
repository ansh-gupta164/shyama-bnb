const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const MongoUrl= 'mongodb://127.0.0.1:27017/shyama'

main()
.then(()=>{
    console.log("connected to DB shyama init");
    
}).catch((err)=>{
    console.log(err);
    
})

async function main(){
    await mongoose.connect(MongoUrl)
    
}

const initDB = async() =>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("data init");
    
    
}

initDB();