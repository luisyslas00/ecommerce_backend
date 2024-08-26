const { Router } = require('express')
const { uploader } = require('../utils/multer.js')
const ProductDaoMongo = require('../dao/MONGO/productDao.mongo.js')
const CartDaoMongo = require('../dao/MONGO/cartDao.mongo.js')
const MessageDaoMongo = require('../dao/MONGO/messageDao.mongo.js')
const jwt = require('jsonwebtoken')
const { objectConfig } = require('../config/config.js')
const { UserDtoDB } = require('../dtos/userDB.dto.js')
const { auth } = require('../middleware/auth.middleware.js')
const { checkAuth } = require('../middleware/checkAuthtoken.middleware.js')
const { extractUserInfo } = require('../middleware/extractUserInfo.middleware.js')
const { checkNotAuthenticated } = require('../middleware/verifyLogin.middleware.js')
const {private_key} = objectConfig

const cartManager = new CartDaoMongo()
const messageManager = new MessageDaoMongo()
const productManager = new ProductDaoMongo()

const router = Router()

router.get('/',extractUserInfo,(req,res)=>{
    let userDb = req.user?.fullname || req.user?.first_name
    let cartDB = req.user?.cartID
    res.render('index',{
        title:"Home | Tienda",
        styles:'styles.css',
        cartID:cartDB,
        user:userDb,
    })
})

router.post('/upload-file',uploader.single('myFile'),(req,res)=>{
    res.render('successFile')
})

router.get("/chat",auth(["user","premium"]),extractUserInfo,async(req,res)=>{
    try{
        let userDb = req.user?.fullname || req.user?.first_name
        let cartDB = req.user?.cartID
        const messages = await messageManager.getMessages()
        res.render("chat",{
            title:'Chat | Tienda',
            messagesExiste:messages.length!==0,
            messages,
            styles:'styles.css',
            cartID:cartDB,
            user:userDb,
        })
    }
    catch(error){
        req.logger.error('Error de ingreso al chat')
    }
})

router.get("/products",extractUserInfo,async(req,res)=>{
    const {newPage,limit,ord} = req.query
    const {docs, totalPages,page,hasPrevPage,hasNextPage,prevPage,nextPage} = await productManager.getProducts({newPage,limit,ord})
    let userDb = req.user?.fullname || req.user?.first_name
    let cartDB = req.user?.cartID
    let userEmail = req.user?.email
    res.render("products",{
        title:"Productos | Tienda",
        products:docs,
        productsExist:docs.length!==0,
        page,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        styles:'styles.css',
        cartID:cartDB,
        user:userDb,
        userEmail:userEmail
    })
})

router.get('/carts/:cid',auth(["user","premium"]),extractUserInfo,async(req,res)=>{
    const {cid}=req.params
    const cart = await cartManager.getCart(cid)
    const products = cart.products
    let userDb = req.user?.fullname || req.user?.first_name
    let cartDB = req.user?.cartID
    res.render("carts",{
        products:products,
        styles:'styles.css',
        cartID:cartDB,
        user:userDb,
        productsExist:products?.length>0
    })
})

router.get('/login',checkNotAuthenticated,extractUserInfo,async(req,res)=>{
    let cartDB = req.user?.cartID
    res.render("login",{
        title:"Iniciar Sesión | Tienda",
        styles:'styles.css',
        cartID:cartDB,
    })
})

router.get('/register',checkNotAuthenticated,extractUserInfo,async(req,res)=>{
    let cartDB = req.user?.cartID
    res.render("register",{
        title:"Registrarse | Tienda",
        styles:'styles.css',
        cartID:cartDB
    })
})

router.get('/realtimeproducts',auth(["admin","premium"]),extractUserInfo,async(req,res)=>{
    try{
        let userDb = req.user?.fullname || req.user?.first_name
        let cartDB = req.user?.cartID
        let userEmail = req.user?.email
        res.render('realTimeProducts',{
            styles:'styles.css',
            cartID:cartDB,
            user:userDb,
            userEmail:userEmail
        })
    }
    catch(error){
        console.log(error)
    }
})

router.get('/resetpassword',async(req,res)=>{
    res.render('resetPassword',{
        styles:'styles.css'
    })
})

router.get('/resetpassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, private_key);
        
        if (!decoded) {
            return res.redirect('/expired');
        }

        res.render('resetPasswordForm', { 
            token:token,
            styles:'styles.css'
        });
    } catch (error) {
        req.logger.error('Token no válido')
        res.redirect('/expired');
    }
});

router.get('/expired', async (req, res) => {
    res.render('expired',{
        styles:'styles.css'
    })
});

router.get('/profile',auth(["admin","premium","user"]),extractUserInfo,async(req,res)=>{
    let userDb = req.user?.fullname || req.user?.first_name
    let cartDB = req.user?.cartID
    let role = req.user?.role
    res.render('profile',{
        styles:'styles.css',
        cartID:cartDB,
        user:userDb,
        id:req.user?._id,
        role:role==='premium'
    })
})

module.exports = router