const { productsModel } = require('./models/products.model.js')
const { mongoose } = require('mongoose')

class ProductDaoMongo{
    constructor(){
        this.productsModel = productsModel;
    }
    async getProducts({ limit = 9, newPage = 1, ord = 1 } = {}) {
        const products = await this.productsModel.paginate(
            {},
            {
                limit,
                page: newPage,
                sort: { price: Number(ord) },
                lean: true
            }
        );
        return products;
    }
    async addProduct(objeto){
        const products = await this.productsModel.find()
        const {title,description,price,thumbnail,code,stock,category} = objeto
        if(title===""||description===""||Number(price)===0||thumbnail===""||code===""||Number(stock)===0||category===''){
            return {status:'failed', payload:"Rellenar correctamente los campos"}
        }
        let repite = products.some(elemento=>{
            return elemento.code === code
        })
        if(repite){
            return {status:'failed', payload: "Código repetido"}
        }else{
            return await this.productsModel.create(objeto)
        }
    }
    async updateProduct(id,objeto){
        const {title,description,price,thumbnail,code,stock} = objeto
        const products = await this.productsModel.find()
        if(!title, !description,!price,!thumbnail,!code,!stock){
            return {status:'failed',payload:'Faltan campos'}
        }
        return await this.productsModel.updateOne({_id:id},objeto)
    }
    async deleteProduct(id){
        const result = await this.productsModel.deleteOne({_id:id})
        return result
    }
    async getProductById(id){
        const result = await this.productsModel.find({_id:id})
        return result
    }
}

module.exports = ProductDaoMongo