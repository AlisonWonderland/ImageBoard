const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const Admin = require('../models/Admin')
const { isVerifiedRefreshToken } = require('../utils/auth')
const { checkCredentials } = require('../utils/middleware')
const authenticationRouter = require('express').Router()

authenticationRouter.post('/login', async (req, res) => {
    const body = req.body;
    const admin = await Admin.findOne({ username: body.username });

    if (admin) {
      const validPassword = await bcrypt.compare(body.password, admin.password);
      
      if (validPassword) {
        const payload = { username: admin.username, permissions: admin.permissions, settings: admin.settings }

        const token = jwt.sign(payload, config.PIN, {
            expiresIn: 5
        });
        // console.log('admin:', admin)
        // issues a new refresh token if the old one expired
        let refreshToken = {}
        
        if(!isVerifiedRefreshToken(admin.refreshToken)) {
            refreshToken = jwt.sign(payload, config.PIN, {
                expiresIn: 30 // make 48 hours for real version
            })

            admin.refreshToken = refreshToken
            await admin.save()
        }
        else {
            // not needed if not storing it in local storage
            refreshToken = admin.refreshToken
        }

        console.log('final refresh token', refreshToken, '\n', 'and token:', token, 'settings', payload.settings)

        // don't need refresh token i think
        res.status(200).json({token, refreshToken});
      } 

      else {
        res.status(401).json({ error: "Invalid login" });
      }
    } 
    
    else {
      res.status(401).json({ error: "Invalid login" });
    }
})

// pass in the refresh token in header from client, works in body too
authenticationRouter.post('/refresh', checkCredentials, (req, res) => {
    // const authHeader = req.headers.authorization
    // let refreshToken = ''
    // // after verifi middleware change this to refreshToken = req.body.token
    
    // // console.log('refresh headers', req.headers)
    // // console.log('auth header:', req.headers.authorization)
    
    // // could be a helper
    // if (authHeader.startsWith("Bearer ")){
    //     refreshToken = authHeader.substring(7, authHeader.length);
    // } 
    // else {
    //     //Error
    //     res.status(400).send({messages: 'Wrong header used in request', intercepted: true })
    // }

    // console.log('body from refresh', req.body)
    const payload = req.body.payload
    // console.log('payload:', payload)

    
    // maybe later errors could be cauth by errorHandlers/middleware. try it out
  
        delete payload.iat
        delete payload.exp
        // username: payload.username, permissions: payload.permissions
        const newAccessToken = jwt.sign({ ...payload }, config.PIN, {
            expiresIn: 5 // expires in 100 secs
        });

        res.status(200).json({newAccessToken})
    
})

module.exports = authenticationRouter