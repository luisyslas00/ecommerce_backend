const { objectConfig } = require("../config/config.js")
const { UserDtoDB } = require("../dtos/userDB.dto.js")
const { userService, cartService } = require("../service/index.js")
const { createHash, isValidPassword } = require("../utils/bcrypt.js")
const { generateToken } = require("../utils/jwt.js")
const {private_key,port} = objectConfig
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../utils/sendMail.js")

class userController {
    constructor(){
        this.userService = userService
        this.cartService = cartService
    }
    register = async(req,res)=>{
        const { first_name,last_name,age,email,password } = req.body
        if(!password || !email) return res.send({status:'failed',message:'Completar los datos'})
        const userFound = await this.userService.getUser({email})
        if(userFound) return res.send({status:'failed',message:'Usuario existente'})
        const newCart = {
            "products":[]
        }
        const cart = await this.cartService.addCart(newCart)
        const newUser ={
            first_name,
            last_name,
            age,
            email,
            cartID:cart._id,
            password: createHash(password)
        }
        const result = await this.userService.createUser(newUser)
        const token = generateToken({
            email,
            id:result._id,
            first_name,
            last_name
        })
        res.cookie('token',token,{
            maxAge:60*60*1000*24,
            httpOnly:true
        }).send({status:'success',message:'Usuario registrado'})
    }
    login = async(req,res)=>{
        const {email,password} =req.body
        if(!password || !email) return res.send({status:'failed',message:'Completar los datos'})
        const userFound = await this.userService.getUser({email})
        if(!isValidPassword({password:userFound.password},password)) return res.send({status:'failed',message:'Datos incorrectos'})
        const token = generateToken({
            id:userFound._id,
            email,
            first_name: userFound.first_name,
            last_name: userFound.last_name,
            role:userFound.role,
            cartID:userFound.cartID
        })
        res.cookie('token',token,{
            maxAge:60*60*1000*24,
            httpOnly:true
        })
        .send({status:'success',message:'Usuario logueado'})
    }
    logout = (req,res)=>{
        req.session.destroy((error)=>{
            if(error){
                return res.send({status:"failed",error:error})
            }else{
                return res.redirect('/login')
            }
        })
        if(req.cookies["token"]){
            res.clearCookie('token')
        }
    }
    current = async(req,res)=>{
        const {email} =req.user
        const userFound = await this.userService.getUser({email})
        const user = new UserDtoDB(userFound)
        res.send({status:'success',payload:user})
    }
    resetPassword = async(req,res)=>{
        try{
            const {email} = req.body
            const userFound = await this.userService.getUser({email})
            if(!userFound) return res.send({status:'failed',payload:'User not found'})
            console.log(userFound)
            const token = jwt.sign({ id: userFound._id }, private_key, { expiresIn: '1h' });
            const resetLink = `http://${req.headers.host}/resetpassword/${token}`;
            const html = `<h1>Resetea tu contraseña <a href='${resetLink}'>AQUÍ</a></h1>`
            sendEmail({userMail:userFound.email,subject:`Reseteo password ${userFound.first_name}`,html})
            res.send({status:"success",payload:userFound.email})
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = { 
    userController
}