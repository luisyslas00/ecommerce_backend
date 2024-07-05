class UserDtoDB{
    constructor(user){
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.fullname = `${user.first_name} ${user.last_name}`
        this.cartID = user.cartID
        this.role = user.role
    }
}

module.exports = {
    UserDtoDB
}