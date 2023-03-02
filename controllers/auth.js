const {StatusCodes} = require('http-status-codes')
const UnauthenticatedError = require('../errors/authenticationError')
const BadRequestError = require('../errors/badrequestError')
const User = require('../models/auth')

const localLogin = async(req, res)=>{
    const {email, password} = req.body
    
    if(!email && !password){
        throw new BadRequestError('Please provide email and password')
    }
    
    const user = await User.findOne({email})  
    if(!user){
        throw new UnauthenticatedError('Email is not registered')
    } 

    if(!user.password){
        throw new UnauthenticatedError('Password is incorrect')
    }
    const isMatch = await user.comparePassword(password)
    console.log(typeof password)
    if(!isMatch){
        throw new UnauthenticatedError('Password is incorrect')
    }
    res.status(StatusCodes.OK).json({user, message: 'success', success: true })
}

module.exports = {localLogin}