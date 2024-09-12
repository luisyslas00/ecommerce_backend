const { cartsModel } = require('./models/carts.model.js');
const { productsModel } = require('./models/products.model.js');

class CartDaoMongo{
    constructor(){
        this.cartsModel = cartsModel;
    }
    async getCart(id){
        return await this.cartsModel.findOne({_id:id}).lean() 
    }
    async addCart(cart){
        return await this.cartsModel.create(cart)
    }
    async addProduct(cid,pid){
        const searchCart = await this.cartsModel.findOne({"_id":cid})
        let productExist=false
        if(searchCart){
            for(const cartProduct of searchCart.products){
                if(cartProduct.product._id.toString()===pid){
                    cartProduct.quantity++;
                    productExist=true
                    break
                }
            }
            if(!productExist){
                searchCart.products.push({product:pid,quantity:1})
            }
        }
        const resp = await this.cartsModel.findByIdAndUpdate({"_id":cid},searchCart)
        return resp
    }
    async deleteCart(id){
        const searchCart = await this.cartsModel.findOne({"_id":id})
        searchCart.products = []
        return await this.cartsModel.findByIdAndUpdate({_id:id},searchCart)
    }
    async deleteProduct(cid,pid){
        const result =  await this.cartsModel.updateOne({ _id: cid }, { $pull: { products: { product:{_id: pid} } } });
        return result
    }
    async updateCart(cid,newProducts){
        const result = await this.cartsModel.updateOne({ _id: cid }, { $set: { products: newProducts } })
        return result
    }
    async updateQuantity(cid,pid,newQuantity){
        const cart = await this.cartsModel.findById(cid);
        let productExist=false
        if(cart){
            for(const cartProduct of cart.products){
                if(cartProduct.product._id.toString()===pid){
                    cartProduct.quantity+=Number(newQuantity);
                    productExist=true
                    break
                }
            }
            if(!productExist){
                cart.products.push({product:pid,quantity:Number(newQuantity)})
            }
        }
        const result = await this.cartsModel.findByIdAndUpdate({"_id":cid},cart)
        return result
    }
    async endPurchase(cid){
        return await this.cartsModel.findById(cid);
    }
}

module.exports = CartDaoMongo
