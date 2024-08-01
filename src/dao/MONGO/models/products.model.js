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
    stock:Number,
    owner: {
        type: String,
        ref: 'users',
        default: 'admin'
    }
})

productsSchema.plugin(moongosePaginate)

productsSchema.pre('save', async function(next) {
    if (!this.owner) {
        const adminUser = await model('users').findOne({ email: 'admin' });
        if (adminUser) {
            this.owner = adminUser._id; 
        }
    }
    next();
});

const productsModel = model('products',productsSchema)

module.exports = {
    productsModel
}