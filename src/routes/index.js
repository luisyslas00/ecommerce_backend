const { Router } = require("express")

const viewsRouter = require('./views.router.js')
const productsRouter = require('./api/products.router.js')
const cartsRouter = require('./api/carts.router.js')
const chatRouter = require('./api/chat.router.js')
const sessionsRouter = require('./api/sessions.router.js')
const mockingRouter = require('./api/mocking.router.js')
const loggerTest = require('./api/loggerTest.router.js')
const usersRouter = require('./api/users.router.js')

const router = Router()

router.use('/',viewsRouter)
router.use('/api/products',productsRouter)
router.use('/api/carts',cartsRouter)
router.use('/api/chat',chatRouter)
router.use('/api/users',usersRouter)
router.use('/api/sessions',sessionsRouter)
router.use('/api/mockingproducts',mockingRouter)
router.use('/api/loggertest',loggerTest)


//Escuchamos el servidor
router.use((error,req,res,next)=>{
    console.log(error)
    res.status(500).send('Error 500 en el server')
    return next()
})

module.exports = router
