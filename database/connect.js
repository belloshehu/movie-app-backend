const mongoose = require('mongoose')

const connectDB = async(url) => {
    return mongoose.connect(url)
}
mongoose.set('strictQuery', true)


module.exports = connectDB