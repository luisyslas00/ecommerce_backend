const mongoose = require("mongoose");
const ProductDaoMongo = require("../src/dao/MONGO/productDao.mongo");
const Asserts = require('assert');
const { objectConfig } = require("../src/config/config");
const { beforeEach } = require("mocha");
const {mongo_prueba} = objectConfig

mongoose.connect(mongo_prueba)

const assert = Asserts.strict

describe('Test Product DAO con mocha',function(){
    //Antes de cada contexto
    before(function(){
        this.productDao = new ProductDaoMongo()
    })
    //Antes de cada test
    beforeEach(function(){
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    })
    it('Debe obtener correctamente los productos en formato Array',async function(){
        const result = await this.productDao.getProducts()
        const products = result.docs
        assert.strictEqual(Array.isArray(products),true)
    })
    it('Debe agregar correctamente un producto a la base de datos',async function(){
        let mockProduct = {
            title: "Televisor",
            description: "20 pulgadas",
            price:120000,
            thumbnail:"https://google.com.ar",
            category:"Tecno",
            code:"121349834981",
            stock:200,
            owner:"admin"
        }
        const result = await this.productDao.addProduct(mockProduct)
        assert.ok(result._id)
    })
    it('Debe filtrar un producto, mediante una propiedad',async function () {
        let mockProduct = {
            title: "Televisor",
            description: "20 pulgadas",
            price:120000,
            thumbnail:"https://google.com.ar",
            category:"Tecno",
            code:"121349834981",
            stock:200,
            owner:"admin"
        }
        const result = await this.productDao.addProduct(mockProduct)
        const product = await this.productDao.getProductFilter({_id:result._id})
        assert.strict(typeof product, 'object')
    })
})
