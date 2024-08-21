const { objectConfig } = require("../config/config.js")
const {private_key} = objectConfig
const jwt = require('jsonwebtoken')
const { UserDtoDB } = require("../dtos/userDB.dto.js")

const auth = (roles) =>{
    return async(req,res,next)=>{
        let userToken
        if(req.cookies["token"]){
            const userCookie = jwt.verify(req.cookies["token"], private_key)
            const userFound = new UserDtoDB(userCookie)
            userToken = userFound
        }
        if(!req.user&&!userToken){
            return res.redirect('/'); 
        }
        const user = req.user || userToken;
        if(!roles.includes(user.role)){
            return res.redirect('/'); 
        } 
        next()
    }
}

module.exports = {
    auth
}
