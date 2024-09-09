const { objectConfig } = require("../config/config.js")
const { UserDtoDB } = require("../dtos/userDB.dto.js")
const { userService, cartService } = require("../service/index.js")
const { createHash, isValidPassword } = require("../utils/bcrypt.js")
const { generateToken, generateTokenPass } = require("../utils/jwt.js")
const {private_key} = objectConfig
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../utils/sendMail.js")
const { usersModel } = require("../dao/MONGO/models/users.model.js")


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
                cartID:userFound.cartID,
                documents:userFound.documents
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
            let documentsUser = user.documents.filter(doc=> doc.name === 'document')
            if(documentsUser){
                user.role = user.role === 'user' ? 'premium' : 'user';
            }
            if(user.role === 'user'){
                const nameToDelete = 'document';
                let documentsDB = user.documents.filter(doc => doc.name !== nameToDelete);
                user.documents = documentsDB
            }
            await user.save();
            if(req.user.role !=='admin'){
                if(req.cookies["token"]){
                    const token = generateToken({
                        _id:user._id,
                        email:user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role:user.role,
                        cartID:user.cartID,
                        documents:user.documents
                    })
                    res.cookie('token',token,{
                        maxAge:60*60*1000*24,
                        httpOnly:true
                    })
                }
                if(req.session?.user){
                    req.session.user.role = user.role
                    req.session.user.documents = user.documents
                }
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
            if (!files || files.length === 0) {
                return res.status(400).json({ status: 'failed', message: 'No files uploaded' });
            }
            const documents = files.map(file => ({
                name: file.fieldname,
                reference: `/uploads/${file.fieldname}s/${file.filename}`
            }));
            const user = await this.userService.getUser({'_id':uid})
            if (!user) {
                return res.status(404).json({ status: 'failed', message: 'User not found' });
            }
            user.documents.push(...documents)
            if(req.user.role !=='admin'){
                if(req.cookies["token"]){
                    const token = generateToken({
                        _id:user._id,
                        email:user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role:user.role,
                        cartID:user.cartID,
                        documents:user.documents
                    })
                    console.log(token)
                    res.cookie('token',token,{
                        maxAge:60*60*1000*24,
                        httpOnly:true
                    })
                }
                if(req.session?.user){
                    req.session.user.documents = user.documents
                }
            }
            await user.save()
            res.status(200).json({ status: 'success', message: 'Documents uploaded successfully',result:documents});
        } catch (error) {
            res.status(500).json({ status: 'failed', error: error.message });
            req.logger.error('Error al subir archivos')
        }
    }
    getUsers = async(req,res)=>{
        try {
            const users = await this.userService.getUsers()
            let usersDB = []
            users.forEach(element => {
                const user = new UserDtoDB(element)
                usersDB.push(user)
            });
            res.send({status:'success',message:usersDB})
        } catch (error) {
            req.logger.error('Error al obetener usuarios')
        }
    }
    deleteUsers = async(req,res)=>{
        try {
            const threshold = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const inactiveUsers = await usersModel.find({ last_connection: { $lt: threshold } });
            if (inactiveUsers.length === 0) {
                return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar.' });
            }
            const deletePromises = inactiveUsers.map(async user => {
                if(user.role !== 'admin'){
                    let html =`<p>Hola ${user.fullname || user.first_name},</p>
                       <p>Tu cuenta ha sido eliminada debido a la inactividad de más de 2 días.</p>`
                    sendEmail({userMail:user.email,subject:`Cuenta eliminada por inactividad`,html})
                    return this.userService.deleteUser({ _id: user._id });
                }
            });
    
            await Promise.all(deletePromises);
    
            res.status(200).json({ message: `Se ha/n eliminado ${inactiveUsers.length} usuario/s inactivo/s y se le/s ha enviado un correo de notificación.` });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor.' });
            req.logger.error('Error al borrar usuarios')
        }
    }
}

module.exports = { 
    userController
}