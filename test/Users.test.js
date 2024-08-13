const chai = require('chai')
const mongoose = require('mongoose')
const UserDaoMongo = require('../src/dao/MONGO/userDao.mongo')
const { objectConfig } = require('../src/config/config')
const {mongo_prueba} = objectConfig

const expect = chai.expect
mongoose.connect(mongo_prueba)

describe('Test Users con chai',()=>{
    before(function(){
        this.userDao = new UserDaoMongo()
    })
    beforeEach(function(){
        mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })
    it('Debe obtener los usuarios en formato Array',async function(){
        const result = await this.userDao.getUsers()
        expect(result).to.be.deep.equal([])
    })
    it('Debe agregar un usuario a la base de datos',async function(){
        let mockUser = {
            first_name:'Juan',
            last_name:'Gimenez',
            email:'juan@gmail.com',
            age:30,
            password:'123456',
        }
        const result = await this.userDao.createUser(mockUser)
        expect(result).to.have.property('_id')
    })
    it('Debe traer un usuario en formato objeto a través de un filtro',async function() {
        let mockUser = {
            first_name:'Juan',
            last_name:'Gimenez',
            email:'juan@gmail.com',
            age:30,
            password:'123456',
        }
        const result = await this.userDao.createUser(mockUser)
        const user = await this.userDao.getUser({email:mockUser.email})
        expect(user).to.have.an('object')
    })
})