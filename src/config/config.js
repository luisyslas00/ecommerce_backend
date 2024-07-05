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
    persistence:process.env.PERSISTENCE
}

module.exports = {
    objectConfig
}