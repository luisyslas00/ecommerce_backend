const {createTransport} = require('nodemailer')
const { objectConfig } = require('../config/config')

const { gmail_pass,gmail_user }=objectConfig

const transport = createTransport({
    service:'gmail',
    port:578,
    auth:{
        user:gmail_user,
        pass:gmail_pass
    }
})

const sendEmail = async({userMail,subject,html})=>{
    return await transport.sendMail({
        from:'Ecommerce Yslas<yslasluis92@gmail.com>',
        to: userMail,
        subject,
        html
    })
}

module.exports = {
    sendEmail
}