const jwt = require('jsonwebtoken')
const { objectConfig } = require('../config/config.js')
const {private_key} = objectConfig

const generateToken = user => jwt.sign(user,private_key,{expiresIn:'24h'})

const generateTokenPass = user => jwt.sign(user,private_key,{expiresIn:'1h'})

module.exports = {
    generateToken,
    generateTokenPass
}