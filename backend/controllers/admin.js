const bcrypt = require("bcrypt");
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const { checkCredentials } = require('../utils/middleware')
const {
    getAdmins,
    createAdmin,
    updatePassword,
    updateSettings,
    deleteSpecificAdmins
} = require('../models/Admin')
const adminRouter = require('express').Router()

adminRouter.get('/', (req, res) => {
    getAdmins(res)
})

adminRouter.post('/add', async (req, res) => {
    const body = req.body;

    if (!(body.username && body.password)) {
        return res.status(400).send({ messages: "Password or username missing" });
    }

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
    
    createAdmin(res, body)
})

adminRouter.put('/password', async(req, res) => {
    const body = req.body
    let token = ''
    const authHeader = req.headers.authorization
    // console.log('body', req.body, config.PIN, body.currentPassword)

    if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
   } 
   else {
      res.status(400).send({messages: 'Wrong header used in request'})
   }

//    console.log('token', token)

    try {
        const payload = jwt.verify(token, config.PIN)
        updatePassword(res, body, payload.username)         
    }
    catch (err) {
        // console.log(err.name)
        // console.log(err)
        if(err.name === 'TokenExpiredError')
            res.status(401).send({messages: 'Invalid user token. Please sign in again.'})
        else
            res.status(500).send({messages: 'Unknown error occured. Please try again.'})
    }
})


adminRouter.put('/updateSettings', checkCredentials, async(req, res) => {
    console.log('req body in settings', req.body)
    const newSettings = req.body.settings
    const { username } = req.body.payload

    updateSettings(res, newSettings, username)
})


adminRouter.delete('/multiple', checkCredentials, async (req, res) => {
    const adminsToDelete = req.body.usernames
    deleteSpecificAdmins(res, adminsToDelete)
})

module.exports = adminRouter