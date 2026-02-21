const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config({ path: "../.env" });

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB Atlas");

    await initDB();

    mongoose.connection.close();
}

const initDB = async () => {
    await Listing.deleteMany({});

    const ownerId = new mongoose.Types.ObjectId("6992673e1bafae74b4592a2f");

    const updatedData = initData.data.map(obj => ({
        ...obj,
        owner: ownerId
    }));

    await Listing.insertMany(updatedData);

    console.log("Database Seeded Successfully");
};

main().catch(err => console.log(err));