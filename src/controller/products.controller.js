const CustomError = require("../service/errors/CustomError.js")
const EErrors = require("../service/errors/enum.js")
const generateProductError = require("../service/errors/info.js")
const { productService } = require("../service/index.js")

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
        try{
            const result = await this.productService.addProduct(req.body)
            const {title,description,price,thumbnail,code,stock,category} = req.body
            if(title===""||description===""||Number(price)<=0||thumbnail===""||code===""||Number(stock)<=0||category===''){
                CustomError.createError({
                    name:"Error al crear el producto",
                    cause: generateProductError({title,description,price,thumbnail,code,stock,category}),
                    message:"Error al crear el producto. Rellene los campos correctamente",
                    code: EErrors.INVALID_TYPES_ERROR
                })
                // console.log("ERROR --")
                // CustomError.createError({
                //     name:"Error al crear el producto",
                //     cause: generateProductError({title,description,price,thumbnail,code,stock}),
                //     message:"Error al crear el producto. Rellene los campos correctamente",
                //     code: EErrors.INVALID_TYPES_ERROR
                // })
                return {status:'failed', payload:"Rellenar correctamente los campos"}
            }
            if(result.status === 'failed')return res.send(result)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
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