const ticketModel = require("./models/ticket.model");

class TicketDaoMongo{
    constructor(){
        this.ticketModel = ticketModel;
    }
    async createTicket(ticket){
        return await this.ticketModel.create(ticket)
    }
    async getTicket(filter){
        return await this.ticketModel.findOne(filter)
    }
}

module.exports = TicketDaoMongo