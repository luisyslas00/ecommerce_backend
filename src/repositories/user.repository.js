const { UserDto } = require("../dtos/user.dto.js")

class UserRepository{
    constructor(dao){
        this.dao = dao
    }
    getUsers = async() => await this.dao.getUsers()
    getUser = async filter=> await this.dao.getUser(filter)
    createUser = async user=> {
        const newUser = new UserDto(user)
        return await this.dao.createUser(newUser)
    }
}

module.exports = UserRepository
