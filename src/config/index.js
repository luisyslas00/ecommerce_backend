const { connect } = require('mongoose')
const { objectConfig } = require('./config.js')
const { MongoSingleton } = require('./mongoSingleton.js')
const {mongo_url} = objectConfig

const connectDB = () => {
    MongoSingleton.getInstance(mongo_url)
}

module.exports = {
    connectDB
}
