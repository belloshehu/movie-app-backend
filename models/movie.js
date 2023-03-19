const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, "User is required"]
    }, 
    Title: {
        type: String,
        required: [true, "Title is required"]
    }, 
    Year: {
        type: Date,
        required: [true, "Date is required"]
    }, 
    Poster: {
        type: String,
        required: [true, "Poster is required"]
    }, 
    Type: String, 
    imdbID: {
        type: String,
        required: [true, "ImdbID is required"], 
        unique: [true, "Movie already added"]
    }
}, {timestamps: true})

module.exports = mongoose.model('movie', MovieSchema)
