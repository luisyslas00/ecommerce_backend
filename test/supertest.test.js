const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect

//URL BASE
const requester = supertest('http://localhost:3000')

describe('Test del Ecommerce',()=>{
    describe('Test de PRODUCTS',()=>{
        it('El endpoint POST /api/products debe crear un producto correctamente', async()=>{
            let mockProduct = {
                title: "Televisor",
                description: "20 pulgadas",
                price:120000,
                thumbnail:"https://google.com.ar",
                category:"Tecno",
                code:"121349834981",
                stock:200
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products').send(mockProduct)
            //Revisar con token
            // expect(_body.payload).to.have.property('_id')
        })
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
    // describe('Test de CARTS',()=>{

    // })
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