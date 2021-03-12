const bcrypt = require("bcrypt");
const jwt = require('json-web-token')
const Admin = require('../models/Admin')
const authenticationRouter = require('express').Router()

authenticationRouter.post('/login', async (req, res) => {
    const body = req.body;
    const admin = await Admin.findOne({ username: body.username });

    if (admin) {
      // check admin password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, admin.password);
      if (validPassword) {
        res.status(200).json({ message: "Valid password" });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "Invalid login" });
    }
})

module.exports = authenticationRouter