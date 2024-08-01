const jwt = require('jsonwebtoken')
const { objectConfig } = require("../config/config.js")
const {private_key} = objectConfig

const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ status: 'failed', message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, private_key)
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).send({ status: 'failed', message: 'Invalid token' });
    }
}

module.exports = {
    checkAuth
}