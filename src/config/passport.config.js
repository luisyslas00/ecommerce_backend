const passport = require('passport')
const jwt = require('passport-jwt')
const { objectConfig } = require('./config.js')

const {private_key}= objectConfig
const JWTStrategy = jwt.Strategy
const JWTExtract = jwt.ExtractJwt

const cookieExtractor = (req) =>{
    let token = null
    if(req && req.cookies) token = req.cookies['token']
    return token
}

const initializePassport = () =>{
    passport.use('jwt',new JWTStrategy({
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: private_key
    },async(jwt_payload,done)=>{
        try {
            return done(null,jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = {
    initializePassport
}


// const passport = require('passport')
// const local = require('passport-local')
// const UserManager = require('../dao/UserManagerDB.js')
// const { createHash, isValidPassword } = require('../utils/bcrypt')

// const userManager = new UserManager()

// //Creamos la estrategia
// const LocalStrategy = local.Strategy

// const initializePassport = () => {
//     //Register
//     passport.use('register', new LocalStrategy({
//         passReqToCallback: true, // Acceder al password de req
//         usernameField: 'email' //Cambiamos username por email
//     },async(req,username,password,done)=>{
//         const {first_name,last_name} = req.body //username y password ya los trae
//         try{
//             //Verificamos si existe el usuario
//             let userFound = await userManager.getUser({email:username})
//             if(userFound) return done(null,false) //No hay error y que avance, si existe el usuario
//             let newUser = {
//                 first_name,
//                 last_name,
//                 email: username,
//                 password: createHash(password)
//             }
//             let result = await userManager.createUser(newUser)
//             console.log(result)
//             return done(null,result)
//         }catch(error){
//             return done(`Error de registro: ${error}`)
//         }
//     }))
//     //Login
//     passport.use('login', new LocalStrategy({
//         usernameField: 'email'
//     },async(username,password,done)=>{
//         try{
//             const userFound = await userManager.getUser({email:username})
//             if(!userFound){
//                 console.log('Usuario no encontrado')
//                 return done(null, false,{ message: 'Usuario no encontrado' })
//             }
//             if(!isValidPassword(password,{password:userFound.password})){
//                 return done(null,false,{ message: 'Contraseña inválida' })
//             }
//             return done(null,userFound)
//         }catch(error){
//             return done(`Error de login: ${error}`)
//         }
//     }))
//     //Guarda el _id de la DB en session
//     passport.serializeUser((user,done)=>{
//         done(null,user._id)
//     })
//     //Extrae el usuario de session
//     passport.deserializeUser(async(id,done)=>{
//         try {
//             let userFound = await userManager.getUser({_id:id})
//             done(null,userFound)
//         } catch (error) {
//             done(error)
//         }
//     })
// }