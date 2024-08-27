const { objectConfig } = require("../config/config.js")
const { UserDtoDB } = require("../dtos/userDB.dto.js")
const { userService, cartService } = require("../service/index.js")
const { createHash, isValidPassword } = require("../utils/bcrypt.js")
const { generateToken, generateTokenPass } = require("../utils/jwt.js")
const {private_key,port} = objectConfig
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../utils/sendMail.js")

class userController {
    constructor(){
        this.userService = userService
        this.cartService = cartService
    }
    register = async(req,res)=>{
        try {
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
            // const token = generateToken({
            //     email,
            //     id:result._id,
            //     first_name,
            //     last_name
            // })
            // res.cookie('token',token,{
            //     maxAge:60*60*1000*24,
            //     httpOnly:true
            // })
            res.send({status:'success',message:'Usuario registrado'})
        } catch (error) {
            req.logger.error('Error al registrarse')
        }
    }
    login = async(req,res)=>{
        try {
            const {email,password} =req.body
            if(!password || !email) return res.send({status:'failed',message:'Completar los datos'})
            const userFound = await this.userService.getUser({email})
            if(!userFound) return res.send({status:'failed',message:'Usuario inexistente'})
            if(!isValidPassword({password:userFound.password},password)) return res.send({status:'failed',message:'Datos incorrectos'})
            const token = generateToken({
                _id:userFound._id,
                email,
                first_name: userFound.first_name,
                last_name: userFound.last_name,
                role:userFound.role,
                cartID:userFound.cartID
            })
            userFound.last_connection = new Date();
            await userFound.save();
            res.cookie('token',token,{
                maxAge:60*60*1000*24,
                httpOnly:true
            })
            .send({status:'success',message:'Usuario logueado'})
        } catch (error) {
            req.logger.error('Error al loguearse')
        }
    }
    logout = async(req,res)=>{
        try {
            if(req.user){
                const userFound = await this.userService.getUser({'email':req.user.email})
                userFound.last_connection = new Date()
                await userFound.save()
            }
            req.session.destroy((error)=>{
                if(error){
                    return res.send({status:"failed",error:error})
                }else{
                    return res.redirect('/login')
                }
            })
            if(req.cookies["token"]){
                console.log(req.user)
                res.clearCookie('token')
            }
        } catch (error) {
            req.logger.error('Error al cerrar sesión')
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
            const token = generateTokenPass({
                email:userFound.email,
                id:userFound._id
            })
            console.log(token)
            const resetLink = `http://${req.headers.host}/resetpassword/${token}`;
            const html = `<h1>Resetea tu contraseña <a href='${resetLink}'>AQUÍ</a></h1>`
            sendEmail({userMail:userFound.email,subject:`Reseteo password ${userFound.first_name}`,html})
            res.send({status:"success",payload:userFound.email})
        }catch(error){
            req.logger.error('Error al resetear contraseña')
        }
    }
    resetPasswordPass = async(req,res)=>{
        try {
            const {token} =req.params
            const {password,newPassword} = req.body
            const decoded = jwt.verify(token, private_key);
            if (!decoded) {
                return res.send({status:"failed",error:"Error de token"});
            }
            const user = await this.userService.getUser({email:decoded.email})
            if(!password||!newPassword) return res.send({status:"failed",message:"Complete los campos"})
            if(password!==newPassword) return  res.send({status:"failed",message:"Deben coincidir"})
            if(isValidPassword({password:user.password},password)) return res.send({status:"failed",message:"La contraseña NO debe ser igual a la anterior"})
            if(password===newPassword){
                user.password = createHash(newPassword)
                user.save()
                res.send({status:"success",message:"Contraseña actualizada"})
                const html = `<h1>La contraseña en ECOMMERCE CODER, fue cambiada exitosamente!</h1>`
                sendEmail({userMail:user.email,subject:`Cambio de contraseña`,html})
            }
        } catch (error) {
            req.logger.error('Error al cambiar la contraseña')
        }
    }
    changeUserRole = async(req,res)=>{
        try {
            const {uid} = req.params
            const user = await this.userService.getUser({'_id':uid})
            user.role = user.role === 'user' ? 'premium' : 'user';
            if(user.role === 'user'){
                user.documents = []
            }
            await user.save();
            if(req.cookies["token"]){
                const token = generateToken({
                    _id:user._id,
                    email:user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role:user.role,
                    cartID:user.cartID
                })
                res.cookie('token',token,{
                    maxAge:60*60*1000*24,
                    httpOnly:true
                })
            }
            if(req.session?.user){
                req.session.user.role = user.role
            }
            return res.status(200).send({status:"success",message:"Rol actualizado"});
        } catch (error) {
            req.logger.error('Error al cambiar el rol del usuario')
        }
    }
    uploadFiles = async(req,res)=>{
        try {
            const { uid } = req.params;
            const files = req.files;
            console.log(req.files)
            if (!files || files.length === 0 ||files.length < 3) {
                return res.status(400).json({ status: 'failed', message: 'No files uploaded' });
            }
    
            const documents = files.map(file => ({
                name: file.fieldname,
                reference: `/uploads/${file.fieldname}/${file.filename}`
            }));

            const user = await this.userService.getUser({'_id':uid})
            if (!user) {
                return res.status(404).json({ status: 'failed', message: 'User not found' });
            }
            user.documents.push(...documents)
            await user.save()

            res.status(200).json({ status: 'success', message: 'Documents uploaded successfully' });
        } catch (error) {
            res.status(500).json({ status: 'failed', error: error.message });
        }
    }
}

module.exports = { 
    userController
}