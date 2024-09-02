const CustomError = require("../service/errors/CustomError.js")
const EErrors = require("../service/errors/enum.js")
const { productService } = require("../service/index.js")
const { objectConfig } = require("../config/config.js")
const { sendEmail } = require("../utils/sendMail.js")
const {private_key} = objectConfig

class productController {
    constructor(){
        this.productService = productService
    }
    getProducts = async (req,res)=>{
        try{
            const {newPage,limit,ord} = req.query
            const {docs, totalPages,page,hasPrevPage,hasNextPage,prevPage,nextPage} = await this.productService.getProducts({newPage,limit,ord})
            res.send({status:"success",payload:docs,totalPages,prevPage,nextPage,page,hasPrevPage,hasNextPage})
        }
        catch(error){
            req.logger.error('Error al obtener los productos')
        }
    }
    getProductbyId = async(req,res)=>{
        try{
            const {pid} = req.params
            const product = await this.productService.getProductById(pid)
            if(product.status==="failed") return res.send(product)
            res.send({status:'success',payload:product})
        }
        catch(error){
            req.logger.error('Error al obtener el producto (ID)')
        }
    }
    addProduct = async (req,res)=>{
        try {
            const newProduct = req.body
            const {title,description,price,thumbnail,code,stock,category} = newProduct
            if(!title||!description||Number(price)<=0||!thumbnail||!code||Number(stock)<=0||!category){
                res.send({status:"failed",message:"Faltan completar datos"})
            }
            const productFound = await this.productService.getProductFilter({code:code})
            if(productFound) return res.send({status:"failed",message:"Producto ya existente"})
            if(req.user.role ==="premium"){
                newProduct.owner = req.user.email
            }
            const productDB = await this.productService.addProduct(newProduct)
            console.log(productDB)
            res.send({status:"success",payload:productDB})
        } catch (error) {
            req.logger.error("Error al agregar un producto a la BD")
        }
    }
    updateProduct = async(req,res)=>{
        try{
            const {pid} = req.params
            const productUpdate = req.body
            const result = await this.productService.updateProduct(pid,productUpdate)
            if(result.status === 'failed') return res.send(result)
            res.send({status:'success',payload:result})
        }
        catch(error){
            req.logger.error('Error al actualizar el producto')
        }
    }
    deleteProduct = async(req,res)=>{
        try{
            const {pid} = req.params
            const productFound = await this.productService.getProductFilter({_id:pid})
            if(req.user.role==="admin"){
                const result = await this.productService.deleteProduct(pid)
                if(result.status === 'failed') return res.send(result)
                if(productFound.owner !== 'admin'){
                    let html =`<p>Hola!</p>
                       <p>Su producto fue eliminado de nuestra tienda.</p>
                       <p>Producto: ${productFound.title}</p>
                       <p>Precio: $${productFound.price}</p>
                       <p>Stock: ${productFound.stock}</p>
                       `
                    sendEmail({userMail:productFound.owner,subject:`Producto eliminado`,html})
                }
                return res.send({status:'success',payload:result})
            }
            if(productFound.owner !== req.user.email) return res.send({status:"error",message:"Producto no corresponde al usuario"})
            const result = await this.productService.deleteProduct(pid)
            if(result.status === 'failed') return res.send(result)
            res.send({status:'success',payload:result})
        }
        catch(error){
            req.logger.error('Error al eliminar el producto')
        }
    }
}

module.exports = { 
    productController
}