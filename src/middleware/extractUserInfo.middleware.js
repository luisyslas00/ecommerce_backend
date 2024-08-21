const jwt = require('jsonwebtoken')
const { objectConfig } = require("../config/config.js");
const { UserDtoDB } = require('../dtos/userDB.dto.js');
const {private_key} = objectConfig

const extractUserInfo = (req,res,next) =>{
    if(req.cookies["token"]){
        try{
            const userCookie = jwt.verify(req.cookies["token"], private_key)
            const userFound = new UserDtoDB(userCookie)
            req.user = userFound
        }catch(error){
            req.logger.error('Error de autenticación')
        }
    }else{
        req.user = req.session?.user
    }
    next()
}

module.exports = {
    extractUserInfo
}