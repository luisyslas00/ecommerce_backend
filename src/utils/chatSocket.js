const { messageService } = require("../service");

const chatSocket = io =>{
    io.on('connection',async socket=>{
        const messagesDB = await messageService.getMessages()
        let messages = []
        messagesDB.forEach(element => {
            let message = {'user':element.user,'message':element.message}
            messages.push(message)
        });
        socket.emit('mensajes',messages)
        socket.on('enviarMensaje',async()=>{
            const mensajesNuevos = await messageService.getMessages()
            let mensajes = []
            mensajesNuevos.forEach(element => {
                let mensaje = {'user':element.user,'message':element.message}
                mensajes.push(mensaje)
            });
            socket.emit('nuevosMensajes',mensajes)
        })
    })
}

module.exports = {
    chatSocket
}