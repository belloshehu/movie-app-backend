require('dotenv').config()
require('express-async-errors')
const connectDB = require('./database/connect')
const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')

const passport = require('passport')
// const passportSetup = require('./passport')
const passportSetupStrategy = require('./passport-google')
const authRouter = require('./routers/authRouter')
const movieRouter = require('./routers/movieRouter')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

const app  = express()
app.use(cookieSession({name: 'session', keys: [process.env.SESSION_KEY], maxAge: 24 * 60 * 60 * 1000}))
app.use(cors({
    origin: ['http://localhost:3000', 'https://movie-app-belloshehu.vercel.app/'],
    credentials: true,
    methods: 'GET,PUT,POST,PATCH,DELETE'
}))

// set encoding middleware
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize())
app.use(passport.session())

// routers
app.get('/', async(req, res)=>{
    res.send('Welcome to favoriteMovies home page')
})
app.use('/auth', authRouter)
app.use('/favorite', movieRouter)

// other middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const mongoURI = process.env.SERVER === 'production'? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/movie-app'

const startServer = async() => {
    try {
        await connectDB(mongoURI)
        app.listen('5000', async() => {
            console.log('Server listening on port 5000')
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()