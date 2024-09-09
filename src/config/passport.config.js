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