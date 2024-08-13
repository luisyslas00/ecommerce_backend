//dotenv
const dotenv = require('dotenv')
dotenv.config()

const objectConfig = {
    port:process.env.PORT || 8080,
    mongo_url:process.env.MONGO_URL,
    private_key:process.env.PRIVATE_KEY,
    session_secret:process.env.SESSION_SECRET,
    client_id:process.env.CLIENT_ID,
    client_secret:process.env.CLIENT_SECRET,
    persistence:process.env.PERSISTENCE,
    node_env:process.env.NODE_ENV,
    gmail_pass:process.env.GMAIL_PASS,
    gmail_user:process.env.GMAIL_USER,
    mongo_prueba:process.env.MONGO_PRUEBA
}

module.exports = {
    objectConfig
}