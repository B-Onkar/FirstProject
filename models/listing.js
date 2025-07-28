const mongoose = require("mongoose")
const review = require("./review")
const Schema = mongoose.Schema

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-flat-screen-tv-JhkY1M6HN9Y",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-flat-screen-tv-JhkY1M6HN9Y" : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

const Listing = mongoose.model("Listing", ListingSchema)
module.exports = Listing