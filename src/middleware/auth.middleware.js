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
        if(!req.user&&!userToken) return res.status(401).send({status:'error',error:'Unauthorized'})
        const user = req.user || userToken;
        if(!roles.includes(user.role)) return res.status(401).send({ status: 'error', error: 'Not Permissions' });
        next()
    }
}

module.exports = {
    auth
}
