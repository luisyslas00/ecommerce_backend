const { Router } = require('express')

const router = Router()

router.get('/',async(req,res,next)=>{
     req.logger.fatal('Fatal')
     req.logger.error('Error')
     req.logger.warning('Warning!')
     req.logger.info('Info')
     req.logger.http('http')
     req.logger.debug('debug')
     res.send('logs')
})

module.exports = router