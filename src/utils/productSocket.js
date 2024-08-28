const { productService } = require("../service")

const productSocket = io =>{
    io.on('connection',async socket=>{
        const products = await productService.getProducts({limit: 1000, newPage: 1, ord: 1})
        socket.emit('listaProductos',products)
        socket.on('addProducts',async()=>{
            const updatedProducts = await productService.getProducts({ limit: 1000, newPage: 1, ord: 1 });
            socket.emit('listaProductosActualizada', updatedProducts);
        })
    })
}

module.exports = {
    productSocket
}
