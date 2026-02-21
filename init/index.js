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
    initData.data= initData.data.map((obj)=>({...obj, owner:"6992673e1bafae74b4592a2f"}))
    await Listing.insertMany(initData.data)
    
    console.log("data init");
    
    
}

initDB();