const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    director: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        required: false,
    },
    releaseDate: {
        type: Date,
        required: false,
    },
    duration: {
        type: Number, // in minutes
        required: false,
    },
    rating: {
        type: Number, // IMDb or custom scale
        min: 0,
        max: 10,
    },
    description: {
        type: String,
    },
    cast: [
        {
            name: String,
            role: String,
        },
    ],
    posterUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})
const movieModel = mongoose.model("movie",movieSchema);

module.exports = movieModel;