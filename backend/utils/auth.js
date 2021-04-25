const config = require('../config/config')
const jwt = require('jsonwebtoken')

const isVerifiedRefreshToken = (refreshToken) => {
    console.log('refresh token in verfication:', refreshToken)
    if(refreshToken === null) {
        return false
    }
    else {
        try {
            jwt.verify(refreshToken, config.PIN)
            return true
        }
        catch(err) {
            return false
        }
    }
}


module.exports = {
    isVerifiedRefreshToken
}