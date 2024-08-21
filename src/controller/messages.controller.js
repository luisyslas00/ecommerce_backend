const { messageService } = require("../service/index.js");

class messageController {
    constructor(){
        this.messageService = messageService
    }
    sendMessage = async (req, res) => {
        try {
            const mensaje = req.body; 
            await this.messageService.sendMessage(mensaje)
            res.send("Mensaje enviado")
        } catch (error) {
            req.logger.error('Error al enviar el mensaje')
        }
    }
}

module.exports = { 
    messageController
}