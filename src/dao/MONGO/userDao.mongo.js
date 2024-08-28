const { usersModel } = require('./models/users.model.js')

class UserDaoMongo{
    constructor(){
        this.usersModel = usersModel;
    }
    async getUsers(){
        return await this.usersModel.find().lean()
    }
    async createUser(user){
        return await this.usersModel.create(user)
    }
    async getUser(filter){
        return await this.usersModel.findOne(filter)
    }
    async deleteUser(id){
        const result = await this.usersModel.deleteOne({_id:id})
        return result
    }
}

module.exports = UserDaoMongo