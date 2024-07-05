
class CartRepository{
    constructor(dao){
        this.dao = dao;
    }
    getCart = async id=>{
        try{
            const result = await this.dao.getCart(id)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Carrito no encontrado"}
        }
    }
    addCart = async cart => {
        try {
            return await this.dao.addCart(cart)
        } catch (error) {
            return {status:'failed',payload:"No pudo agregarse el carrito"}
        }
    }
    addProduct = async (cid,pid)=>{
        try{
            const resp = await this.dao.addProduct(cid,pid)
            return resp
        }
        catch(error){
            return {status:'failed', payload:"Error al agregar el producto"}
        }
    }
    deleteCart = async id =>{
        try{
            const res = await this.dao.deleteCart(id)
            return res
        }
        catch(error){
            return {status:'failed', payload:"Error al eliminar el carrito"}
        }
    }
    deleteProduct = async (cid,pid) =>{
        try{
            const result =  await this.dao.deleteProduct(cid,pid)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al eliminar el producto"}
        }
    }
    updateCart = async(cid,newProducts)=>{
        try{
            const result = await this.dao.updateCart(cid,newProducts)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al actualizar el carrito"}
        }
    }
    updateQuantity= async(cid,pid,newQuantity)=>{
        try{
            const result = await this.dao.updateQuantity(cid,pid,newQuantity)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al actualizar la cantidad"}
        }
    }
    endPurchase = async(cid)=>{
        try{
            const result = await this.dao.endPurchase(cid)
            return result
        }
        catch(error){
            return {status:'failed', payload:"Error al actualizar la cantidad"}
        }
    }
}

module.exports = CartRepository