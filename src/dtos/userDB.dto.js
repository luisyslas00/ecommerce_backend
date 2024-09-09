class UserDtoDB{
    constructor(user){
        this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.fullname = `${user.first_name} ${user.last_name}`
        this.cartID = user.cartID
        this.role = user.role
        this.documents = user.documents
    }
}

module.exports = {
    UserDtoDB
}