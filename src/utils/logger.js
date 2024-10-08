const winston = require('winston');
const { objectConfig } = require('../config/config');
const { node_env } = objectConfig

const customLevelsOptions = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors:{
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    }
};

const productionLogger = winston.createLogger({
    levels:customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'error',
            format: winston.format.simple()
        })
    ]
})

const developmentLogger = winston.createLogger({
    levels:customLevelsOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:'error',
            format: winston.format.simple()
        })
    ]
})

const logger = node_env === 'production' ? productionLogger : developmentLogger;

module.exports = {
    logger
}