const { connect } = require('mongoose')
const { objectConfig } = require('./config.js')
const {mongo_url} = objectConfig

const connectDB = () => {
    connect(mongo_url)
    console.log('Base de datos conectada')
}

module.exports = {
    connectDB
}
