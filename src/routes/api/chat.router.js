const { Router } = require('express');
const { messageController } = require('../../controller/messages.controller.js');

const router = Router()

const {sendMessage} = new messageController()

router.post('/', sendMessage);

module.exports = router
