class MessageRepository{
    constructor(dao){
        this.dao = dao
    }
    async sendMessage(objeto){
        return await this.dao.sendMessage(objeto)
    }
    async getMessages(){
        return await this.dao.getMessages()
    }
}

module.exports = MessageRepository