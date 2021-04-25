const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = { 
    login: (res, body) => {
        const lookupQuery = `SELECT password, permissions FROM admins WHERE username = '${body.username}';
                    SELECT darkMode FROM admin_settings WHERE username = '${body.username}';`

        db.query(lookupQuery, (err, lookupResults) => {
            if(err) {
                res.status(500).send({messages: 'Unknown error occured'})
            }
            else if(lookupResults[0].length === 0) { 
                res.status(401).json({ error: "Invalid login" });
            }
            else {
                bcrypt.compare(body.password, lookupResults[0][0].password, (err, comparisonResult) => {
                    if(comparisonResult) {
                        const payload = { username: body.username, permissions: lookupResults[0][0].permissions }

                        const token = jwt.sign(payload, config.PIN, {
                            expiresIn: 600
                        })
        
                        let refreshToken = jwt.sign(payload, config.PIN, {
                            expiresIn: 3600
                        })
                        
                        const setRefreshToken = `UPDATE admins SET refreshToken = '${refreshToken}' WHERE username = '${body.username}';`
                        db.query(setRefreshToken, (err, refreshResults) => {
                            if(err) {
                                res.status(500).send({messages: 'Unknown error occured'})
                            }
                            else {
                                res.status(200).json({token, refreshToken, settings: {darkMode: Boolean(lookupResults[1][0].darkMode)}});        
                            }
                        })
                    }
                    else {
                        res.status(401).json({ error: "Invalid login" });
                    }
                })
            }
        })
    },
    getAdmins: (res) => {
        let query = "SELECT * FROM admins;"
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send({messages: 'Error occured retrieving admins'})
            }
            else {
                res.json(results)
            }
        })
    },
    updatePassword: (res, body, username) => {
        const lookupQuery = `SELECT password FROM admins WHERE username = '${username}';`


        db.query(lookupQuery, (err, queryResult) => {
            if(err) {
                res.status(500).send({messages: 'Error occured retrieving admin'})
            }
            else {
                bcrypt.compare(body.currentPassword, queryResult[0].password, (err, comparisonResult) => {
                    if(comparisonResult) {
                        const saltRounds = 10
                        
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            bcrypt.hash(body.newPassword, salt, function(err, hash) {
                                const updateQuery = `UPDATE admins SET password = '${hash}' WHERE username = '${username}';`
                                
                                db.query(updateQuery, (err, results) => {
                                    if(err) {
                                        res.status(500).send({messages: 'Error occured updating password'}) 
                                    }
                                    else {
                                        res.status(200).end()
                                    }
                                })
                            });
                        });
                    }
                    else {
                        res.status(401).send({messages: 'Password doesn\'t match current password.', currentPasswordError: true})
                    }
                })
            }
        })
    },
    updateSettings: (res, newSettings, username) => {
        const query = `UPDATE admin_settings SET darkMode = ${newSettings.darkMode} WHERE username = '${username}';`
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send({messages: 'Error occured updating settings'}) 
            }
            else {
                res.status(200).end()
            }
        })
    },
    deleteSpecificAdmins: (res, usernames) => {
        let query = `DELETE FROM admins WHERE username IN ('${usernames.join("','")}');
                DELETE FROM admin_settings WHERE username IN ('${usernames.join("','")}');`
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send({messages: 'Error occured deleting admins'})
            }
            else {
                res.status(200).end()
            }
        })
    },
    createAdmin: (res, adminData) => {
        let addThread = `INSERT INTO admins (
                username,
                password,
                permissions
            )
            VALUES
            (
                '${adminData.username}', 
                '${adminData.password}',
                '${adminData.permissions}'
            );
            INSERT INTO admin_settings(username) 
            VALUES('${adminData.username}');
        `
        
        db.query(addThread, (err, results) => {
            if(err) {
                res.status(500).send({messages: 'Error adding admins'}) 
            }
            else {
                res.status(201).json({
                    ...adminData, 
                    commentsDeleted: 0,
                    threadsDeleted: 0,
                    totalPostsDeleted: 0,
                    lastDeletionDate: null
                })
            }
        })
    }
}