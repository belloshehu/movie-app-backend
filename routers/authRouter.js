const router = require('express').Router()
const passport = require('passport')


router.get('/logout', async(req, res) =>{
    res.logout()
    res.redirect('http://localhost:3000/')
})

router.get('/login/success', (req, res) => {
    console.log(req.profile)
    if(req.user){
        res.status(200).json({
            success: true,
            message: 'Login success',
            user: req.user
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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google',  {
        successRedirect: 'http://localhost:3000/',
        failureRedirect: '/login/failed',
}))

module.exports = router