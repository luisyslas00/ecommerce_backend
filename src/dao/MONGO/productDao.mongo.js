const { productsModel } = require('./models/products.model.js')

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
        return await this.productsModel.create(objeto)  
    }
    async getProductFilter(filter){
        return await this.productsModel.findOne(filter)
    }
    async updateProduct(id,objeto){
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