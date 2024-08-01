const CustomError = require("../service/errors/CustomError.js")
const EErrors = require("../service/errors/enum.js")
const generateProductError = require("../service/errors/info.js")
const { productService } = require("../service/index.js")
const { objectConfig } = require("../config/config.js")
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
            console.log(error)
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
            console.log(error)
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
            console.log(req.user.role)
            if(req.user.role ==="premium"){
                newProduct.owner = req.user.email
            }
            await this.productService.addProduct(newProduct)
            res.send({status:"success",message:newProduct})
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
            console.log(error)
        }
    }
    deleteProduct = async(req,res)=>{
        try{
            const {pid} = req.params
            const result = await this.productService.deleteProduct(pid)
            if(result.status === 'failed') return res.send(result)
            res.send({status:'success',payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
}

module.exports = { 
    productController
}