const { cartService, ticketService } = require("../service/index.js")
const jwt = require('jsonwebtoken')
const { objectConfig } = require('../config/config.js')
const { UserDtoDB } = require('../dtos/userDB.dto.js')
const crypto = require('crypto')
const {private_key} = objectConfig

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
            req.logger.error('Error al obtener el carrito')
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
            req.logger.error('No se pudo eliminar el producto o no existe')
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
            let userDb
            if(req.cookies["token"]){
                const userCookie = jwt.verify(req.cookies["token"], private_key)
                const userFound = new UserDtoDB(userCookie)
                userDb = userFound.email
            }
            let userEmail = userDb || req.session?.user?.email
            const result = await this.cartService.endPurchase(cid)
            let newTicket 
            if(result>0){
                newTicket = await ticketService.createTicket({amount:result,purchaser:userEmail,code:crypto.randomUUID()})
            }
            res.send({status:"success",payload:newTicket})
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { 
    cartController
}