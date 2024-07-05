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