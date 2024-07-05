const { cartService } = require("../service/index.js")


class cartController {
    constructor(){
        this.cartService = cartService
    }
    createCart = async(req,res)=>{
        try{
            const cart = {
                "products":[]
            }
            const result = await this.cartService.addCart(cart)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
    getCart = async (req,res)=>{
        try{
            const {cid} = req.params
            const cart = await this.cartService.getCart(cid)
            if(cart.status==="failed") return res.send(cart)
            res.send({status:"success",payload:cart})
        }
        catch(error){
            console.log(error)
        }
    }
    addProduct = async(req,res)=>{
        try{
            const {cid,pid} = req.params
            const result = await this.cartService.addProduct(cid,pid)
            if(result.status==="failed") return res.send(result)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
    deleteProduct = async(req,res)=>{
        try{
            const {cid,pid}=req.params
            const result = await this.cartService.deleteProduct(cid,pid)
            if(result.status==="failed") return res.send(result)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
    updateCart = async(req,res)=>{
        try{
            const { cid } = req.params;
            const newProducts = req.body;
            const result = await this.cartService.updateCart(cid,newProducts)
            if(result.status==="failed") return res.send(result)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
    updateQuantity = async(req,res)=>{
        try{
            const { cid, pid } = req.params;
            const newQuantity = req.body.quantity;
            console.log(req.body)
            const result = await this.cartService.updateQuantity(cid,pid,newQuantity)
            console.log(result)
            if(result.status==="failed") return res.send(result)
            res.send({status:"success",payload:result})
        }
        catch(error){
            console.log(error)
        }
    }
    deleteProducts = async(req,res)=>{
        const {cid} = req.params
        const result = await this.cartService.deleteCart(cid)
        if(result.status==="failed") return res.send(result)
        res.send({status:"success",payload:result})
    }
    endPurchase = async(req,res)=>{
        try {
            const {cid} = req.params
            const result = await this.cartService.endPurchase(cid)
            res.send({status:"success",payload:result})
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { 
    cartController
}