const { objectConfig } = require("../config/config.js");

let ProductDao
let CartDao
let UserDao
let MessageDao
let TicketDao
switch (objectConfig.persistence) {
    case "FS":
        const {default:CartDaoFile} = require("./FS/CartManagerFS.js");
        CartDao = CartDaoFile
        const {default:ProductDaoFile} = require("./FS/ProductManagerFS.js");
        ProductDao = ProductDaoFile
        break;
    default:
        const ProductDaoMongo = require("./MONGO/productDao.mongo.js");
        const CartDaoMongo = require("./MONGO/cartDao.mongo.js");
        const UserDaoMongo = require("./MONGO/userDao.mongo.js");
        const MessageDaoMongo = require("./MONGO/messageDao.mongo.js");
        const TicketDaoMongo = require("./MONGO/ticketDao.mongo.js");
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        UserDao = UserDaoMongo
        MessageDao = MessageDaoMongo
        TicketDao = TicketDaoMongo
        break;
}

module.exports = {
    ProductDao,
    CartDao,
    UserDao,
    MessageDao,
    TicketDao
}