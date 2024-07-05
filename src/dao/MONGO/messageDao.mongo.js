const { messagesModel } = require('./models/messages.model.js')

class MessageDaoMongo{
    constructor(){
        this.messagesModel = messagesModel
    }
    async sendMessage(objeto){
        return await this.messagesModel.create(objeto)
    }
    async getMessages(){
        return await this.messagesModel.find().lean()
    }
}

module.exports = MessageDaoMongo