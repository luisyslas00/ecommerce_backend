const { Schema, model }  = require("mongoose");

// Define el esquema del ticket
const ticketSchema = new Schema({
    code: {
        type:String
    },
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
    },
    products:{
        type:Array
    }
});


const ticketModel = model('Ticket', ticketSchema);
  
module.exports = ticketModel;