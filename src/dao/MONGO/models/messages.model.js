const { Schema , model } = require('mongoose')

const messagesSchema = new Schema({
    user:String,
    message:String
})

const messagesModel = model('messages',messagesSchema)

module.exports = {
    messagesModel
}