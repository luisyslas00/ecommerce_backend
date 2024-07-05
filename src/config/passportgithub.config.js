const passport = require('passport')
const GitHubStrategy = require('passport-github2')
const UserDaoMongo = require('../dao/MONGO/userDao.mongo.js')
const { createHash, isValidPassword } = require('../utils/bcrypt.js')
const CartDaoMongo = require('../dao/MONGO/cartDao.mongo.js')
const { objectConfig } = require('./config.js')
const {client_id,client_secret,port} = objectConfig
const userManager = new UserDaoMongo()
const cartManager = new CartDaoMongo()
//Creamos la estrategia

const initializePassportGithub = () => {
    passport.use('github', new GitHubStrategy({
        clientID:client_id,
        clientSecret:client_secret,
        callbackURL:'http://localhost:'+port+'/api/sessions/githubcallback'
    },async(accessToken,refreshToken,profile,done)=>{
        try {
            // console.log(profile)
            let user = await userManager.getUser({email:profile._json.email})
            if(!user){
                const newCart = {
                    "products":[]
                }
                const cart = await cartManager.addCart(newCart)
                let newUser = {
                    first_name:profile._json.name,
                    last_name:'',
                    email:profile._json.email,
                    password:'',
                    cartID:cart._id,
                }
                let result = await userManager.createUser(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
            
        } catch (error) {
            return done(error)
        }
    }))
    


    //Guarda el _id de la DB en session
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    //Extrae el usuario de session
    passport.deserializeUser(async(id,done)=>{
        try {
            let userFound = await userManager.getUser({_id:id})
            done(null,userFound)
        } catch (error) {
            done(error)
        }
    })
}

module.exports = {
    initializePassportGithub
}