// generates objects/classes for use of modules
const multer  = require('multer')
const Memcached = require('memcached')

module.exports = {
    memcached: new Memcached("127.0.0.1:11211"),
    upload: multer()
}