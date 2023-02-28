require('dotenv').config()
const connectDB = require('./database/connect')
const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport')
const passportSetup = require('./passport')
const authRouter = require('./routers/authRouter')

const app  = express()

app.use(cookieSession({name: 'session', keys: [process.env.SESSION_KEY] ,maxAge: 24 * 60 * 60 * 1000}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,PUT,POST,PATCH'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth', authRouter)

const mongoURI = process.env.MONGO_URI

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