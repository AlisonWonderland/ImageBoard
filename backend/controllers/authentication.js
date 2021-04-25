const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { 
    login
} = require('../models/Admin');
// const { isVerifiedRefreshToken } = require('../utils/auth')
const { checkCredentials } = require('../utils/middleware')
const authenticationRouter = require('express').Router()

authenticationRouter.post('/login', async (req, res) => {
    const body = req.body;
    // console.log(body)
    login(res, body)
})

authenticationRouter.post('/refresh', checkCredentials, (req, res) => {
    const payload = req.body.payload

    delete payload.iat
    delete payload.exp
    // username: payload.username, permissions: payload.permissions
    const newAccessToken = jwt.sign({ ...payload }, config.PIN, {
        expiresIn: 600 // expires in 100 secs
    });

    res.status(200).json({newAccessToken})
})

module.exports = authenticationRouter