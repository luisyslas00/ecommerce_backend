const jwt = require('jsonwebtoken')
const { objectConfig } = require("../config/config.js");
const { UserDtoDB } = require('../dtos/userDB.dto.js');
const {private_key} = objectConfig

const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    console.log(!token && !req.session.user)
    if (!token && !req.session.user) {
        return res.status(401).send({ status: 'failed', message: 'No token provided' });
    }
    if(token){
        try {
            console.log('Estoy en Token')
            console.log(token)
            const decoded = jwt.verify(token, private_key)
            const user = new UserDtoDB(decoded)
            req.user = user;
        } catch (err) {
            return res.status(401).send({ status: 'failed', message: 'Invalid token' });
        }
    }
    if(req.session.user){
        try {
            const user = new UserDtoDB(req.session.user)
            req.user = user
        } catch (error) {
            return res.status(401).send({ status: 'failed', message: 'Invalid token' });
        }
    }
    next();
}

module.exports = {
    checkAuth
}