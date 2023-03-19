const {StatusCodes} = require('http-status-codes')
const BadRequestError = require('../errors/badrequestError')
const MovieModel = require('../models/movie')


const createFavoriteMovie = async(req, res) => {
    const {Title, Year, Poster, Type, imdbID} = req.body
    
    if(!Title){
        throw new BadRequestError("Please provide Title")
    }
    if(!Year){
        throw new BadRequestError("Please provide Year")
    }
    if(!Poster){
        throw new BadRequestError("Please provide Poster")
    }
    if(!imdbID){
        throw new BadRequestError("Please provide imdbID")
    }

    const existingMovie = await MovieModel.findOne({imdbID})
    if(existingMovie){
        throw new BadRequestError(`Movie with imdbID ${imdbID} is already added`)
    }

    const movie = await MovieModel.create({...req.body, user: req.user.userID})

    res.status(StatusCodes.CREATED).json({
        message: "Favourite movie created",
        success: true, 
        movie
    })
} 

const getAllFavorites = async (req, res) => {
    const movies = await MovieModel.find({user: req.user.userID})

    res.status(StatusCodes.OK).json({movies})
}

const deleteFavoriteMovie = async (req, res) =>{
    const {id} = req.params
    console.log('removing...', id)
    const movie = await MovieModel.findOneAndDelete({_id: id, user: req.user.userID})

    if(!movie){
        throw new BadRequestError(`Movie with ID ${id} not found`)
    }

    res.status(StatusCodes.OK).json({
        message: "Favorite movie removed",
        success: true,
        movie
    })
}

module.exports = { createFavoriteMovie, deleteFavoriteMovie, getAllFavorites}