const { Schema, model } = require('mongoose')
const moongosePaginate = require('mongoose-paginate-v2')

const productsSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    status:{
        type:Boolean,
        default: true
    },
    category:{
        type:String,
        index:true
    },
    code:{
        type: String,
        unique: true
    },
    stock:Number
})

productsSchema.plugin(moongosePaginate)

const productsModel = model('products',productsSchema)

module.exports = {
    productsModel
}