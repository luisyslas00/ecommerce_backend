const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect

//URL BASE
const requester = supertest('http://localhost:3000')

describe('Test del Ecommerce',()=>{
    describe('Test de PRODUCTS',()=>{
        // it('El endpoint POST /api/products debe crear un producto correctamente', async()=>{
        //     let mockProduct = {
        //         title: "Televisor",
        //         description: "20 pulgadas",
        //         price:120000,
        //         thumbnail:"https://google.com.ar",
        //         category:"Tecno",
        //         code:"121349834981",
        //         stock:200
        //     }
        //     const {
        //         statusCode,
        //         ok,
        //         _body
        //     } = await requester.post('/api/products').send(mockProduct)
        //     //Revisar con token
        //     console.log(_body)
        //     // expect(_body.payload).to.have.property('_id')
        // })
        it('Traer todos los productos en el endpoint GET /api/products', async()=>{
            const {
                ok
            } = await requester.get('/api/products')
            expect(ok).to.be.equal(true)
        })
        it('Traer un producto por su id en el endpoint GET /api/products/:pid',async()=>{
            const pid = '663fa8bf9376a71d3f827577'
            const {
                _body
            } = await requester.get(`/api/products/${pid}`)
            expect(_body.payload[0]).to.have.property('_id')
        })
    })
    describe('Test de CARTS',()=>{
        it('El endpoint POST /api/carts debe crear un carrito correctamente', async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/carts').send()
            expect(_body.payload).to.have.property('products')
        })
        it('El endpoint POST /api/carts/:cid/product/:pid debe agregar un producto al carrito', async () => {
            let pid = '66abc73d45d179af1d71fff3'
            const newCart = await requester.post('/api/carts').send()
            const cid = newCart._body.payload._id
            const {
                ok
            } = await requester.post(`/api/carts/${cid}/product/${pid}`).send()
            expect(ok).to.be.true
        })
        it('El endpoint GET /api/carts/:cid debe obtener los productos de un carrito específico', async () => {
            const cid = '6687462441bdfebcf3f84946'
            const {
                statusCode,
                ok,
                _body
            } = await requester.get(`/api/carts/${cid}`)
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.true
            expect(_body.payload).to.have.property('products').that.is.an('array')
        })
    })
    describe('Test de SESSIONS',()=>{
        let cookie
        it('Debe registrar correctamente un usuario',async()=>{
            let mockUser = {
                first_name:'Juan',
                last_name:'Gimenez',
                email:'juan@gmail.com',
                age:30,
                password:'123456',
            }
            const {_body} = await requester.post('/api/sessions/register').send(mockUser)
            expect(_body.status).to.be.equal('success')
        })
        it('Debe loguearse correctamente',async()=>{
            let mockUser = {
                email:'juan@gmail.com',
                password:'123456',
            }
            const result = await requester.post('/api/sessions/login').send(mockUser)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.equal('token')
            expect(cookie.value).to.be.ok
        })
    })
})