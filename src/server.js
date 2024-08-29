//Importamos
const express = require('express')
const handlebars = require('express-handlebars')
const { connectDB } = require('./config/index.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const routerApp = require('./routes/index.js')
const { initializePassport } = require('./config/passport.config.js')
const { initializePassportGithub } = require('./config/passportgithub.config.js')
const { Server } = require('socket.io')
const { objectConfig } = require('./config/config.js')
const { productSocket } = require('./utils/productSocket.js')
const { addLogger } = require('./middleware/logger.middleware.js')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUIExpress = require('swagger-ui-express')
const { userSocket } = require('./utils/userSocket.js')
const {port,session_secret,mongo_url} = objectConfig


const app = express()

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info:{
            title:'Documentación de Ecommerce Yslas',
            description:'API para documentar - Ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
//Importante la configuración
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
//Cookie Parser
app.use(cookieParser())
// app.use(session({
//     secret:'s3cr3t0Y',
//     resave:true,
//     saveUninitialized:true
// }))
app.use(addLogger)
//Session con MONGODB
app.use(session({
    store:MongoStore.create({
        mongoUrl:mongo_url,
        ttl:60*60*1000*3,
    }),
    secret:session_secret,
    resave:true,
    saveUninitialized:true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 3600000 , // 24 horas en milisegundos
        expires: new Date(Date.now() + 3600000 ) // Expira en 1 hora
    }
}))

//swagger
const specs = swaggerJSDoc(swaggerOptions)


//Passport
initializePassport()
initializePassportGithub()
app.use(passport.initialize())
app.use(passport.session())

//Configurando hbs
app.engine('hbs',handlebars.engine({
    extname:'.hbs'
}))
app.set('views',__dirname+'/views')
app.set('view engine','hbs')

//Ruta Documentación Swagger
app.use('/api/docs',swaggerUIExpress.serve,swaggerUIExpress.setup(specs))
//RouterApp
app.use(routerApp)

connectDB()

//Configuración Socket
const httpServer = app.listen(port,error=>{
    if(error) return console.log(error)
    console.log("Server escuchando")
})
const io = new Server(httpServer)

productSocket(io)
userSocket(io)