const { Router } = require('express')
const { cartController } = require('../../controller/carts.controller.js')
const { auth } = require('../../middleware/auth.middleware.js')
const {createCart,getCart,addProduct,deleteProduct,updateCart,updateQuantity,deleteProducts,endPurchase} = new cartController()


const router = Router()
//Creando cart
router.post('/',createCart)

//Leer cada carrito
router.get('/:cid',auth(["user","premium"]),getCart)

//Agregar productos, indicando id cart y id product
router.post('/:cid/product/:pid',addProduct)

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/product/:pid',deleteProduct)

//Modificar el carrito con un arreglo de productos
router.put('/:cid',updateCart)

//Actualizar la cantidad del producto que se le pase por req.body
router.put('/:cid/product/:pid',updateQuantity)

//Eliminar todos los productos del carrito
router.delete('/:cid',deleteProducts)

//Proceso de compra
router.post('/:cid/purchase',endPurchase)

module.exports = router