const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('./models/auth')

passport.serializeUser((user, done) =>{
    done(null, user.id)
})

passport.deserializeUser((id, done) =>{
    const user = User.find({_id: id})
    User.findById(user._id)
    .then((user) =>{
        return done(null, user)
    })
    .catch((error) =>{
        console.log(error)
    })
})

passport.use( new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        // passReqToCallback: true
    }, (accessToken, refreshToken, profile, done) =>{
    
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
        }) 
    } 
))

