const { Router } = require('express')
const { productController } = require('../../controller/products.controller.js')
const { auth } = require('../../middleware/auth.middleware.js')
const { checkAuth } = require('../../middleware/checkAuthtoken.middleware.js')
const { uploader } = require('../../middleware/multer.middleware.js')

const router = Router()

const {getProducts,getProductbyId,addProduct,updateProduct,deleteProduct} = new productController

//Se muestran los productos en la ruta '/api/products'
router.get('/',getProducts)
// //Ver producto por ID
router.get('/:pid',getProductbyId)
//Agregar producto -- VERIFICAR
router.post('/',checkAuth,addProduct)
// //Modificar producto
router.put('/:pid',updateProduct)
// //Eliminar producto
router.delete('/:pid',checkAuth,deleteProduct)

module.exports = router