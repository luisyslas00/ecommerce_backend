const {connect} = require('mongoose')
const { logger } = require('../utils/logger')

class MongoSingleton{
    static #instance
    constructor(url){
        connect(url)
    }
    static getInstance = (url) =>{
        if(this.#instance){
            logger.info('Base de datos YA conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton(url)
        logger.info('Base de datos creada')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}