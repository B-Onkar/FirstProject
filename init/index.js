const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const { object } = require("joi");

main().then(() => {console.log("connected to DB")}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((object) => ({...object, owner: "6889b3a8fb45fdf98ba65528"})) // Add owner field to each listing
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}

initDB()