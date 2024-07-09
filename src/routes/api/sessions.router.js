const { Router } = require('express')
const { auth } = require('../../middleware/auth.middleware.js')
const passport = require('passport')
const { passportCall } = require('../../middleware/passportCall.middleware.js')
const { userController } = require('../../controller/users.controller.js')

const router = Router()
const {register,login,logout,current} = new userController

//Register
router.post('/register',register)

//Login
router.post('/login',login)

//Github
router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user
    console.log(req.session)
    res.redirect('/products')
})

//Logout
router.get('/logout',logout)

//Current
router.get('/current',passportCall('jwt'),auth(['admin', 'user']),current)

module.exports = router



































// //Register - Passport
// router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}),async(req,res)=>{
//     res.send({status:'success',message:'Usuario registrado'})
// })

// //Fail register - Passport
// router.get('/failregister',async(req,res)=>{
//     console.log('Falló el registro')
//     res.send({status:'error',error:'Failed'})
// })

// //Login - Passport
// router.post('/login',passport.authenticate('login',{failureRedirect:'/faillogin'}),async(req,res)=>{
//     if(!req.user) return res.send({status:'error',error:'Credenciales inválidas'})
//     req.session.user = {
//         first_name: req.user.first_name,
//         email: req.user.email
//     }
//     console.log(req.session.user)
//     res.send({status:'success',payload:req.user})
// })

// //Fail login - Passport
// router.get('/faillogin',async(req,res)=>{
//     console.log('Falló el login')
//     res.send({error:'Failed'})
// })