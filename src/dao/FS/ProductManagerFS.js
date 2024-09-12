const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.join(__dirname, 'products_data.json');

class ProductDaoFile {
    async getProducts({ limit = 9, newPage = 1, ord = 1 }) {
        try {
            const productsData = await this.readProductsData();
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