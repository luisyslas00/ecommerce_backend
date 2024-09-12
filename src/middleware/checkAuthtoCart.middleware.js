const jwt = require('jsonwebtoken')
const { objectConfig } = require("../config/config.js");
const { UserDtoDB } = require('../dtos/userDB.dto.js');
const {private_key} = objectConfig

const checkAuthtoCart = (req, res, next) => {
    const token = req.cookies["token"];
    if(token){
        try {
            const decoded = jwt.verify(token, private_key)
            const user = new UserDtoDB(decoded)
            req.user = user;
        } catch (err) {
            return res.status(401).send({ status: 'failed', message: 'Invalid token' });
        }
    }
    if(req.session.user){
        req.user = req.session.user
    }
    if (token && req.session.user) {
        return res.status(401).send({ status: 'failed', message: 'Sin datos' });
    }
    next()
}

module.exports = {
    checkAuthtoCart
}