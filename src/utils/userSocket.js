const { UserDtoDB } = require("../dtos/userDB.dto");
const { userService } = require("../service");

const userSocket = io =>{
    io.on('connection', async socket=>{
        const usersDB = await userService.getUsers()
        let users = []
        usersDB.forEach(user => {
            let userDB = new UserDtoDB(user)
            users.push(userDB)
        });
        socket.emit('listaUsuarios',users)
        socket.on('nuevaLista',async()=>{
            const newUsersRole = await userService.getUsers()
            let newUsers = []
            newUsersRole.forEach(user=>{
                let newUser = new UserDtoDB(user)
                newUsers.push(newUser)
            })
            socket.emit('listaActualizada', newUsers);
        })
    })
}

module.exports = {
    userSocket
}