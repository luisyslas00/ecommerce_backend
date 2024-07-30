const {connect} = require('mongoose')

class MongoSingleton{
    static #instance
    constructor(url){
        connect(url)
    }
    static getInstance = (url) =>{
        if(this.#instance){
            console.log('Base de datos YA conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton(url)
        console.log('Base de datos creada')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}