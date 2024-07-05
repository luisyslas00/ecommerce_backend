const CartRepository = require("../repositories/cart.repository.js");
const MessageRepository = require("../repositories/message.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const UserRepository = require("../repositories/user.repository.js");
const TicketRepository = require("../repositories/ticket.repository.js");
const {CartDao,MessageDao,ProductDao,UserDao,TicketDao} = require("../dao/factory.js");

const cartService = new CartRepository(new CartDao())
const messageService = new MessageRepository(new MessageDao())
const productService = new ProductRepository(new ProductDao())
const userService = new UserRepository(new UserDao())
const ticketService = new TicketRepository(new TicketDao())

module.exports = {
    cartService,
    messageService,
    productService,
    userService,
    ticketService
}