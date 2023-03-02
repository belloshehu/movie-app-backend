const User = require('./models/auth')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback', 
    passReqToCallback: true, 
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({googleID: profile.id})
        .then((currentUser) =>{
            if(currentUser){
                // if user is already saved
                return done(null, currentUser)
            }else{
                // if user is not saved
                new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    email: profile.emails[0].value
                })
                .save()
                .then((savedUser) => {
                    // console.log(savedUser)
                    return done(null, savedUser)
                })
            }
        }).catch((err) => {
            console.log('User not found!', err)
        })
}))

passport.serializeUser((user, cb)=>{
    console.log('users: ', user)
    return cb(null, user.id)
})


passport.deserializeUser(async(id, cb) =>{
    console.log('id: ' , id)
    const user = User.findOne({where: {_id: id}})
    .then((user)=>{
        cb(null, user)
    })
    .catch((err)=>{
        console.log(err)
        cb(err, null)
    })
})