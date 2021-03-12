const bcrypt = require("bcrypt");
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

adminRouter.put('/password', async(req, res) => {

})

adminRouter.delete('/all', async (req, res) => {
    await Admin.deleteMany({})
    res.status(200).end()
})

// deletes one or more
adminRouter.delete('/multiple', (req, res) => {
    const adminsToDelete = req.body
    console.log('adminsTo:', adminsToDelete)
    // await Admin.deleteMany({"username": {"$in": adminsToDelete}})
    res.status(200).end()
})

module.exports = adminRouter