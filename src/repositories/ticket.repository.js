class TicketRepository{
    constructor(dao){
        this.dao = dao
    }
    getTicket = async filter=> await this.dao.getTicket(filter)
    createTicket = async ticket=> {
        return await this.dao.createTicket(ticket)
    }
}

module.exports = TicketRepository