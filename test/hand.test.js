const chai = require('chai')
const { UserDto } = require('../src/dtos/user.dto')
const { createHash, isValidPassword } = require('../src/utils/bcrypt')

const expect = chai.expect

describe('Testing bcrypt utils',()=>{
    it('El servicio debe devolver un hasheo efectivo del password',async function(){
        const password = 'hola'
        const hashPassword = await createHash(password)
        expect(hashPassword).to.not.equal(password)
    })
    it('El hasheo realizado debe compararse de manera efectiva con el password original',async function(){
        const password = 'hola'
        const hashPassword = await createHash(password)
        const passwordValidation = await isValidPassword({password:hashPassword},password)
        expect(passwordValidation).to.be.ok
    })
})