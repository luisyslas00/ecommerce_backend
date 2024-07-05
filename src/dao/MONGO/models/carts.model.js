const { Schema, model} = require('mongoose')

const cartsSchema = new Schema({
    products: {
        type:[{
            product:{
                type:Schema.Types.ObjectId,
                ref:'products'
            },
            quantity:Number,
        }],
    }
})

cartsSchema.pre('findOne',function(){
    this.populate('products.product')
})

const cartsModel = model('carts',cartsSchema)

module.exports = {
    cartsModel
}