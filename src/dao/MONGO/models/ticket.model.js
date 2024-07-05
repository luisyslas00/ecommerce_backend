const { Schema, model }  = require("mongoose");
// const { v4: uuidv4 } = require('uuid')

// Define el esquema del ticket
const ticketSchema = new Schema({
    // code: {
    //     type: String,
    //     unique: true,
    //     default: () => uuidv4().replace(/-/g, '')
    // },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = model('Ticket', ticketSchema);
  
module.exports = ticketModel;