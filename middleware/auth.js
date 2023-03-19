const UnauthenticatedError = require('../errors/authenticationError')
const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError("Invalid authentication")
    }
    const token = authHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userID: decoded.id}
        next()
    }catch(error){
        throw new UnauthenticatedError("Unauthorized accessed")
    }
}

module.exports = authenticateUser