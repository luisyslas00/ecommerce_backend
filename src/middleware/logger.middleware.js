const { logger } = require("../utils/logger")

const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`)
    next()
}

module.exports = {
    addLogger
}