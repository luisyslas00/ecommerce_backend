const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, 'products_data.json');

class ProductDaoFile {
    async getProducts({ limit = 9, newPage = 1, ord = 1 }) {
        try {
            const productsData = await this.readProductsData();
            // Simulando la paginación y ordenamiento en memoria
            const sortedProducts = productsData.sort((a, b) => {
                return ord === 1 ? a.price - b.price : b.price - a.price;
            });
            const startIndex = (newPage - 1) * limit;
            const paginatedProducts = sortedProducts.slice(startIndex, startIndex + limit);
            return paginatedProducts;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return { status: 'failed', payload: "Error al obtener productos" };
        }
    }

    async addProduct(objeto) {
        try {
            const productsData = await this.readProductsData();
            const { title, description, price, thumbnail, code, stock } = objeto;

            if (!title || !description || price === 0 || !thumbnail || !code || stock === 0) {
                return { status: 'failed', payload: "Rellenar correctamente los campos" };
            }

            const productoExistente = productsData.some(producto => producto.code === code);
            if (productoExistente) {
                return { status: 'failed', payload: "Código repetido" };
            }

            const newProduct = { ...objeto, _id: productsData.length + 1 };
            productsData.push(newProduct);
            await this.writeProductsData(productsData);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            return { status: 'failed', payload: "Error al agregar producto" };
        }
    }

    async updateProduct(id, objeto) {
        try {
            const productsData = await this.readProductsData();
            const index = productsData.findIndex(product => product._id === id);
            if (index === -1) {
                return { status: 'failed', payload: "Producto no encontrado" };
            }
            productsData[index] = { ...objeto, _id: id };
            await this.writeProductsData(productsData);
            return { status: 'success' };
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return { status: 'failed', payload: "Error al actualizar producto" };
        }
    }

    async deleteProduct(id) {
        try {
            const productsData = await this.readProductsData();
            const updatedProducts = productsData.filter(product => product._id !== id);
            await this.writeProductsData(updatedProducts);
            return { status: 'success' };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return { status: 'failed', payload: "Error al eliminar producto" };
        }
    }

    async getProductById(id) {
        try {
            const productsData = await this.readProductsData();
            const product = productsData.find(product => product._id === id);
            if (!product) {
                return { status: 'failed', payload: "Producto no encontrado" };
            }
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            return { status: 'failed', payload: "Error al obtener producto por ID" };
        }
    }

    async readProductsData() {
        try {
            const data = await fs.readFile(productsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, retornar un array vacío
                return [];
            }
            throw error;
        }
    }

    async writeProductsData(data) {
        await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
    }
}

module.exports = ProductDaoFile;

// const fs = require('fs')
// const path = './database.json'

// class ProductManager{
//     #products
//     constructor(path){
//         this.#products = []
//         this.path = path
//     }
//     async addProduct(objeto){
//         try{
//             this.#products = await this.leerArchivo()
//             const product = {
//                 id:this.#agregarId(),
//                 title:objeto.title,
//                 description:objeto.description,
//                 price:objeto.price,
//                 thumbnail:objeto.thumbnail,
//                 status:true,
//                 code:objeto.code,
//                 stock:objeto.stock
//             }
//             const {title,description,price,thumbnail,code,stock} = product
//             if(title===""||description===""||price===0||thumbnail===""||code===""||stock===0){
//                 return {status:'failed', payload:"Rellenar correctamente los campos"}
//             }
//             let repite = this.#products.some(elemento=>{
//                 return elemento.code === code
//             })
//             if(repite){
//                 return {status:'failed', payload: "Código repetido"}
//             }else{
//                 this.#products.push(product)
//                 this.writeFile()
//                 return product
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async getProducts(){
//         try{
//             this.#products = await this.leerArchivo()
//             return this.#products
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async getProductById(identificador){
//         try{
//             this.#products = await this.leerArchivo()
//             let buscar= this.#products.find(elemento =>{
//                 return elemento.id === identificador
//             })
//             if(buscar){
//                 console.log(buscar)
//             }else{
//                 console.log("Not Found")
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async updateProduct(id,objeto){
//         try{
//             this.#products = await this.leerArchivo()
//             let existeProducto = this.#products.find(producto=>{
//                 return producto.id === id
//             })
//             if(existeProducto){
//                 let buscarProducto = this.#products.findIndex(elemento=> elemento.id === existeProducto.id)
//                 this.#products[buscarProducto] = {...this.#products[buscarProducto], ...objeto}
//                 this.writeFile()
//                 return this.#products[buscarProducto]
//             }else{
//                 return {status:'failed', payload:'No existe producto con ese id'}
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async deleteProduct(identificador){
//         try{
//             this.#products = await this.leerArchivo()
//             let indexProduct = this.#products.findIndex(elemento=>{
//                 return elemento.id === identificador
//             })
//             if(indexProduct!==-1){
//                 this.#products.splice(indexProduct,1)
//                 this.writeFile()
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
//     async writeFile(){
//         try{
//             await fs.promises.writeFile(this.path,JSON.stringify(this.#products,null,'\t'),'utf-8')
//             console.log("Archivo guardado")
//         }
//         catch(error){
//             console.log("Error")
//         }
//     }
//     async leerArchivo(){
//         try{
//             let archivoJSON = await fs.promises.readFile(this.path,'utf-8')
//             this.#products = JSON.parse(archivoJSON)
//             return this.#products
//         }
//         catch(error){
//             return []
//         }
//     }
//     #agregarId(){
//         if(this.#products.length ===0){
//             return 1
//         }
//         return this.#products.at(-1).id + 1
//     }
// }

// const product = new ProductManager(path)

// module.exports = ProductManager