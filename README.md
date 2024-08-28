# Rutas de endpoints ROUTER
## PRODUCTS
### Mostrar todos los productos
GET /api/products/
### Mostrar un producto por su id
GET /api/products/:pid
### Agregar un producto a la tienda
POST /api/products/
### Modificar un producto por su id
PUT /api/products/
### Eliminar un producto de la tienda
DELETE /api/products/:pid

## CARTS
### Creando un carrito
POST /api/carts/
### Leer cada carrito 
GET /api/carts/:cid
### Agregar productos indicando ID cart y ID product
POST /api/carts/:cid/product/:pid
### Elimina del carrito, el producto seleccionado
DELETE /api/carts/:cid/product/:pid
### Modificar el carrito con un arreglo de productos
PUT /api/carts/:cid
### Actualizar la cantidad del producto que se le pase por req.body
PUT /api/carts/:cid/product/:pid
### Eliminar los productos del carrito
DELETE /api/carts/:cid
### Proceso de compra
POST /api/carts/:cid/purchase

## CHAT
### Enviar mensaje
POST /api/chat

## SESSIONS
### Registrar usuario
POST /api/sessions/register
### Login usuario
POST /api/sessions/login
### Github
GET /api/sessions/github
GET /api/sessions/githubcallback
### Logout
GET /api/sessions/logout
### Current
GET /api/sessions/current
### Reset password
POST /api/sessions/resetpassword
### Reset password con token
POST /api/sessions/resetpassword/:token
### Actualizar rol
POST /api/sessions/premium/:uid
### Subir archivos
POST /api/sessions/:uid/documents

## USERS
### Mostrar usuarios
GET /api/users/
### Borrar usuarios inactivos
DELETE /api/users/

## MOCKING
### Productos con mocking
GET /api/mockingproducts/

## TEST
### Test LOGGER
GET /api/loggertest


