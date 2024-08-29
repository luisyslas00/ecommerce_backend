// const MessageManager = require('../../dao/MessageManagerDB.js')

// const formChat = document.getElementById('formulario-chat')
// const userChat = document.getElementById('user')
// const messageChat = document.getElementById('message')

const chatMessages = document.getElementById('chat-messages')
const sendButton = document.getElementById('sendButton')
const formularioChat = document.getElementById('formulario-chat')
const socket = io()

let messagesLength = 0

socket.on('mensajes',data =>{
    actualizarMensajes(data)
})

function actualizarMensajes(messages){
    chatMessages.innerHTML = ''
    let lastMessage = messages.length-1
    messages.forEach(element => {
        const containerMessage = document.createElement('div')
        containerMessage.className = 'container-message'
        containerMessage.innerHTML =`
            <p class="message-user">📧 ${element.user}</p>
            <p> - ${element.message}</p>`
        chatMessages.append(containerMessage)
    });
}

formularioChat.addEventListener('submit',async(e)=>{
    e.preventDefault()
    const messageInput = document.getElementById('messageInput')
    const userEmail = document.getElementById('email').innerText
    if(messageInput.value !== ''){
        const sendMessage = {
            'user':userEmail,
            'message':messageInput.value
        }
        try {
            const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendMessage)
            });
            const result = await response.json();
            if (result.status === "success") {
                messageInput.value = ''
                Toastify({
                    text: "Mensaje enviado!📩",
                    duration: 3000,
                    newWindow: true,
                    gravity: "top", 
                    position: "right",
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
                socket.emit('enviarMensaje')
                socket.on('nuevosMensajes',data =>{
                    actualizarMensajes(data)
                })
            }else{
                console.log('No se pudo enviar el mensaje')
            }
        }catch (error) {
            console.error('Error:', error);
        }
    }
})
// const messageManager = new MessageManager()

// async function enviarFormulario(){
//     const message ={
//         user:userChat.value,
//         message:messageChat.value
//     }
//     await messageManager.sendMessage(message)
// }

// formChat.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     enviarFormulario()
//     formChat.reset()
// })

