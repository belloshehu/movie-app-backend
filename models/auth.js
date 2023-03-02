const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        required: [true, "Please provide email"],
        unique: [true, "Someone is already using this email "]
    },
    password: {
        type: String,
        minlength: 8,
        // required: [true , 'Password is requied']
    },
    googleID: String,
    facebookID: String
})

UserSchema.pre('save', async(next)=>{
    if (!this.password){
        return
    }else{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }
})

UserSchema.methods.getJWT = function(){
    const token = jwt.sign(
        {id: this._id, }, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )
    return token
}

UserSchema.methods.comparePassword =async (userPassword)=>{
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('user', UserSchema)