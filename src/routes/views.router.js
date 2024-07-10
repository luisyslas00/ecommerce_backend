const { Router } = require('express')
const { uploader } = require('../utils/multer.js')
const ProductDaoMongo = require('../dao/MONGO/productDao.mongo.js')
const CartDaoMongo = require('../dao/MONGO/cartDao.mongo.js')
const MessageDaoMongo = require('../dao/MONGO/messageDao.mongo.js')
const jwt = require('jsonwebtoken')
const { objectConfig } = require('../config/config.js')
const { UserDtoDB } = require('../dtos/userDB.dto.js')
const { auth } = require('../middleware/auth.middleware.js')
const {private_key} = objectConfig

const cartManager = new CartDaoMongo()
const messageManager = new MessageDaoMongo()
const productManager = new ProductDaoMongo()

const router = Router()

router.get('/',(req,res)=>{
    let userDb
    let cartDB
    if(req.cookies["token"]){
        const userCookie = jwt.verify(req.cookies["token"], private_key)
        const userFound = new UserDtoDB(userCookie)
        userDb = userFound.fullname
        cartDB = userFound.cartID
    }
    res.render('index',{
        title:"Home | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID||cartDB,
        user:req.session?.user?.first_name|| userDb,
    })
})

router.post('/upload-file',uploader.single('myFile'),(req,res)=>{
    res.render('successFile')
})

router.get("/chat",auth(["user"]),async(req,res)=>{
    try{
        let userDb
        let cartDB
        if(req.cookies["token"]){
            const userCookie = jwt.verify(req.cookies["token"], private_key)
            const userFound = new UserDtoDB(userCookie)
            userDb = userFound.fullname
            cartDB = userFound.cartID
        }
        //Traer el chat
        const messages = await messageManager.getMessages()
        res.render("chat",{
            title:'Chat | Tienda',
            messagesExiste:messages.length!==0,
            messages,
            styles:'styles.css',
            cartID:req.session?.user?.cartID||cartDB,
            user:req.session?.user?.first_name||userDb,
        })
    }
    catch(error){
        console.log(error)
    }
})

router.get("/products",async(req,res)=>{
    const {newPage,limit,ord} = req.query
    const {docs, totalPages,page,hasPrevPage,hasNextPage,prevPage,nextPage} = await productManager.getProducts({newPage,limit,ord})
    let userDb
    let cartDB
    if(req.cookies["token"]){
        const userCookie = jwt.verify(req.cookies["token"], private_key)
        const userFound = new UserDtoDB(userCookie)
        userDb = userFound.fullname
        cartDB = userFound.cartID
    }
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
        user:req.session?.user?.first_name||userDb,
        cartID:req.session?.user?.cartID||cartDB,
    })
})

router.get('/carts/:cid',auth(["user"]),async(req,res)=>{
    const {cid}=req.params
    const cart = await cartManager.getCart(cid)
    const products = cart.products
    let userDb
    let cartDB
    if(req.cookies["token"]){
        const userCookie = jwt.verify(req.cookies["token"], private_key)
        const userFound = new UserDtoDB(userCookie)
        userDb = userFound.fullname
        cartDB = userFound.cartID
    }
    res.render("carts",{
        products:products,
        styles:'styles.css',
        cartID:req.session?.user?.cartID||cartDB,
        user:req.session?.user?.first_name||userDb,
        productsExist:products.length>0
    })
})

router.get('/login',async(req,res)=>{
    let cartDB
    if(req.cookies["token"]){
        const userCookie = jwt.verify(req.cookies["token"], private_key)
        const userFound = new UserDtoDB(userCookie)
        cartDB = userFound.cartID
    }
    res.render("login",{
        title:"Iniciar Sesión | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID||cartDB
    })
})

router.get('/register',async(req,res)=>{
    let cartDB
    if(req.cookies["token"]){
        const userCookie = jwt.verify(req.cookies["token"], private_key)
        const userFound = new UserDtoDB(userCookie)
        cartDB = userFound.cartID
    }
    res.render("register",{
        title:"Registrarse | Tienda",
        styles:'styles.css',
        cartID:req.session?.user?.cartID||cartDB
    })
})

router.get('/realtimeproducts',auth(["admin"]),async(req,res)=>{
    try{
        let userDb
        let cartDB
        if(req.cookies["token"]){
            const userCookie = jwt.verify(req.cookies["token"], private_key)
            const userFound = new UserDtoDB(userCookie)
            userDb = userFound.fullname
            cartDB = userFound.cartID
        }
        res.render('realTimeProducts',{
            styles:'styles.css',
            cartID:req.session?.user?.cartID||cartDB,
            user:req.session?.user?.first_name||userDb,
        })
    }
    catch(error){
        console.log(error)
    }
})




module.exports = router