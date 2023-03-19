const router = require('express').Router()
const passport = require('passport')
const {localLogin, localSignup} = require('../controllers/auth')


router.route('/login').post(localLogin)
router.route('/signup').post(localSignup)

router.get('/logout', async(req, res) =>{
    if(req.user){
        req.logout()
        res.clearCookie("session", {path:"/",httpOnly:true})
        res.clearCookie("session.sig", {path:"/",httpOnly:true})
     
        return res.redirect('http://localhost:3000/')
    }else{
        res.status(200).send('User already logged out!')
    }
})


router.get('/login/success', async(req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: 'Login success',
            user: req.user,
            token: req.user.getJWT()
        })
    }else{
        res.status(401).json({
            success: false,
            message: 'You are not logged in',
        })
    }
})

router.get('/login/failed', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Login failed',
        user: false
    })
})

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}))

router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login/failed',
    }), (req, res)=>{
        res.redirect('http://localhost:3000/')
    }
)

router.get('/google', passport.authenticate('google', {session: false ,scope: ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google',  {
        failureRedirect: '/login/failed',
        failureMessage: 'Login with Google failed! Try again.', 
        // session: false
    }), (req, res)=>{
        res.set('jwt', req.user.getJWT())
        res.redirect('http://localhost:3000/')
    }
)


module.exports = router