const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    fullname:{
        type:String,
    },
    first_name:String,
    last_name:String,
    email:{
        type: String,
        unique: true
    },
    age:Number,
    password: String,
    cartID: {
        type: Schema.ObjectId,
        ref:'carts'
    },
    role:{
        type:String,
        default:"user",
        enum: ['user','admin','premium']
    }
})

const usersModel = model("users",userSchema)

module.exports = {
    usersModel
}