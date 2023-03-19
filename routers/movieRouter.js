const { deleteFavoriteMovie, createFavoriteMovie, getAllFavorites } = require('../controllers/movie')
const authenticateUser = require('../middleware/auth')

const router = require('express').Router()

router.route('/').post(authenticateUser, createFavoriteMovie)
router.route('/:id').delete(authenticateUser, deleteFavoriteMovie)
router.route('/').get(authenticateUser, getAllFavorites)


module.exports = router