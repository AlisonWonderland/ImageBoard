const bcrypt = require("bcrypt");
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const adminRouter = require('express').Router()

adminRouter.get('/', async (req, res) => {
    const admins = await Admin.find({})
    res.status(201).send(admins)
})

adminRouter.post('/add', async (req, res) => {
    const body = req.body;

    if (!(body.username && body.password)) {
        return res.status(400).send({ messages: "Password or username missing" });
    }

    console.log('body here:', body)
    const user = new Admin(body);
    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(user.password, salt);
    const newUser = await user.save()
    
    res.status(201).send(newUser)
    res.status(200)
})

// passjet through header
adminRouter.put('/password', async(req, res) => {
    const body = req.body
    let token = ''
    const authHeader = req.headers.authorization
    // console.log('headers stringified', JSON.stringify(req.headers));
    // console.log('headers', req.headers);
    console.log('body', req.body, config.PIN, body.currentPassword)

    if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
   } 
   else {
      //Error
      res.status(400).send({messages: 'Wrong header used in request'})
   }

   console.log('token', token)

    try {
        const payload = jwt.verify(token, config.PIN)
        // console.log(username, 'user')
        // console.log(payload)
        const admin = await Admin.findOne({username: payload.username})
        console.log('admmin', admin)
        console.log('payload from put password:', payload)
        // console.log('admmin pass', admin.password)
        const validOldPassword = await bcrypt.compare(body.currentPassword, admin.password);
        
        if(validOldPassword) {
            // reset password
            const salt = await bcrypt.genSalt(10);
    
            admin.password = await bcrypt.hash(body.newPassword, salt);
            await admin.save()
            
            res.status(200).end()
         
        }
        else {
            res.status(401).send({messages: 'Password doesn\'t match current password.', currentPasswordError: true})
        }
    }
    catch (err) {
        console.log(err.name)
        console.log(err)
        if(err.name === 'TokenExpiredError')
            res.status(401).send({messages: 'Invalid user token. Please sign in again.'})
        else {
            res.status(500).send({messages: 'Unknown error occured. Please try again.'})
        }
    }


    // if it reaches here for some reason
    // res.status(500).send({messages: 'Unknown error occured. Please try again.'})
})

adminRouter.put('/updatePermissions', async(req, res) => {
    res.status(200).end()
})

adminRouter.put('/updateSettings', async(req, res) => {
    // first middleware
    // pass user in token, still use auth header. settings in body

    // check for admin settings, if undefined create new adminsettins

    // update settings according to body
    res.status(200).end()
})

adminRouter.delete('/all', async (req, res) => {
    await Admin.deleteMany({})
    res.status(200).end()
})

// deletes one or more
adminRouter.delete('/multiple', async (req, res) => {
    const adminsToDelete = req.body
    console.log('adminsTo:', adminsToDelete)
    // await Admin.deleteMany({"postNum": {"$in": adminsToDelete}})
    res.status(200).end()
})

module.exports = adminRouter