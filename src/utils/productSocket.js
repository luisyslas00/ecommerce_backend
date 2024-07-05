const { productService } = require("../service")

const productSocket = io =>{
    // io.on('connection',async socket=>{
    //     console.log('Cliente conectado')
    //     socket.on('addProduct',async data=>{
    //         await productService.addProduct(data.newProduct)
    //         const products = productService.getProducts()
    //         const productsDB = await products
    //         socket.emit("listaProductos",{productsDB})
    //     })
    //     socket.on('productEliminar',async data=>{
    //         await productService.deleteProduct(Number(data.id))
    //         const products = productService.getProducts()
    //         const productsDB = await products
    //         socket.emit("listaProductos",{productsDB})
    //     })
    // })
    io.on('connection',async socket=>{
        // console.log("Cliente conectado")
        const products = await productService.getProducts({limit: 1000, newPage: 1, ord: 1})
        socket.emit('listaProductos',products)
    })
}

module.exports = {
    productSocket
}