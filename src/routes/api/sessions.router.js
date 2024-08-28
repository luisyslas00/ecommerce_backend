const { Router } = require('express')
const { auth } = require('../../middleware/auth.middleware.js')
const passport = require('passport')
const { passportCall } = require('../../middleware/passportCall.middleware.js')
const { userController } = require('../../controller/users.controller.js')
const { extractUserInfo } = require('../../middleware/extractUserInfo.middleware.js')
const { userService } = require('../../service/index.js')
const { checkAuth } = require('../../middleware/checkAuthtoken.middleware.js')
const { uploader } = require('../../middleware/multer.middleware.js')
const { checkFiles } = require('../../middleware/checkFiles.middleware.js')

const router = Router()
const {register,login,logout,current,resetPassword,resetPasswordPass,changeUserRole,uploadFiles} = new userController

//Register
router.post('/register',register)

//Login
router.post('/login',login)

//Github
router.get('/github',passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    try {
        req.session.user = req.user
        // req.session.cookie({
        //     originalMaxAge: 60000,
        //     httpOnly:true
        // })
        const userFound = await userService.getUser({'email':req.session.user.email})
        userFound.last_connection = new Date()
        await userFound.save()
        res.redirect('/products')
    } catch (error) {
        req.logger.error('Error al loguear con Github')
    }
})

//Logout
router.get('/logout',checkAuth,logout)

//Current
router.get('/current',passportCall('jwt'),auth(['admin', 'user']),current)

router.post('/resetpassword',resetPassword)

router.post('/resetpassword/:token',resetPasswordPass)

//Actualizar rol
router.post('/premium/:uid',extractUserInfo,changeUserRole);

//
router.post('/:uid/documents',uploader.any(),uploadFiles)

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