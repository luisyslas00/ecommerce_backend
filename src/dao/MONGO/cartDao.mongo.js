const { cartsModel } = require('./models/carts.model.js');
const { productsModel } = require('./models/products.model.js');

class CartDaoMongo{
    constructor(){
        this.cartsModel = cartsModel;
    }
    async getCart(id){
        const result = await this.cartsModel.findOne({_id:id}).lean()
        return result
    }
    async addCart(cart){
        return await this.cartsModel.create(cart)
    }
    async addProduct(cid,pid){
        const product = await productsModel.findOne({"_id": pid});
        // if (!product) {
        //     return {status: 'failed', payload: "Producto no encontrado"};
        // }
        // if (product.stock <= 0) {
        //     return {status: 'failed', payload: "Producto sin stock"};
        // }
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
        console.log(result)
        return result
    }
    async endPurchase(cid){
        const cart = await this.cartsModel.findById(cid);
        //RESOLVER ESTO
        let totalAmount = 0;
        const productsToPurchase = [];
        const productsNotPurchase = []
        for (const item of cart.products) {
            const product = item.product;
            if(product.stock>=item.quantity){
                product.stock -= item.quantity
                totalAmount += item.quantity * product.price;
                productsToPurchase.push(product);
                product.save()
            }else{
                productsNotPurchase.push({product:product._id,quantity:item.quantity})
            }
        }
        console.log("Productos comprados:",productsToPurchase)
        console.log("Productos no comprados",productsNotPurchase)
        await this.cartsModel.updateOne({ _id: cid }, { $set: { products: productsNotPurchase } })
        if(productsToPurchase.length !=0){
            // const newTicket = await ticketModel.create({amount:totalAmount})
            // return newTicket
            const result = totalAmount
            return result
        }
    }
}

module.exports = CartDaoMongo
