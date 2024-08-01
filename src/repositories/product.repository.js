class ProductRepository{
    constructor(dao){
        this.dao = dao
    }
    async getProducts(params){
        try {
            return await this.dao.getProducts(params)
        } catch (error) {
            return {status:'failed', payload:"Error al obtener los productos"}
        }
    }
    async addProduct(objeto){
        try {
            return await this.dao.addProduct(objeto)
        } catch (error) {
            return {status:'failed', payload:"No se pudo agregar el producto"}
        }
    }
    async getProductFilter(filter){
        try {
            return await this.dao.getProductFilter(filter)
        } catch (error) {
            return {status:'failed', payload:"No se encontró el producto"}
        }
    }
    async updateProduct(id,objeto){
        try {
            return await this.dao.updateProduct(id,objeto)
        } catch (error) {  
            return {status:'failed', payload:"No se pudo actualizar el producto"}
        }
    }
    async deleteProduct(id){
        try{
            const result = await this.dao.deleteProduct(id)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Producto no encontrado"}
        }
    }
    async getProductById(id){
        try{
            const result = await this.dao.getProductById(id)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Producto no encontrado"}
        }
    }
}

module.exports = ProductRepository