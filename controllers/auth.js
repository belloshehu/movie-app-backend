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

    if(!isMatch){
        throw new UnauthenticatedError('Password is incorrect')
    }
    res.status(StatusCodes.OK).json({user, message: 'success', success: true, token: user.getJWT() })
}


const localSignup = async(req, res) =>{
    const {email, username, password} = req.body
    if(!email || !username || !password){
        throw new BadRequestError('Please provide email, username and password')
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new BadRequestError(`User with ${email} exists`)
    }

    const user = await User.create({email, username, password})
    res.status(StatusCodes.CREATED).json({user, message: 'Sign up successfully', token: user.getJWT()})
}
module.exports = {localLogin, localSignup}