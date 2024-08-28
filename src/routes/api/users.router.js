const { Router } = require('express')
const { userController } = require('../../controller/users.controller')

const router = Router()

const {getUsers,deleteUsers} = new userController

router.get('/',getUsers)
router.delete('/',deleteUsers)

module.exports = router