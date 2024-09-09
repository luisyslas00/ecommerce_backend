class UserDto{
    constructor(user){
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.password = user.password
        this.fullname = `${user.first_name} ${user.last_name}`
        this.cartID = user.cartID
        this.documents = user.documents
    }
}

module.exports = {
    UserDto
}