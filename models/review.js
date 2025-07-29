const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
});

module.exports = Mongoose.model('Review', reviewSchema);