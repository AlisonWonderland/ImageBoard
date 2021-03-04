const { memcached } = require('./generator')
const Comment = require('../models/Comment')

module.exports = {
    // body would return a list of ids, have to the return the comments/replies docs associated with those ids
    // for proper client side rendering
    // going to need to update /api/comment to comments
    updateCache: async function(body, urlType, parentNum, dataToUpdate) {
        const apiType = urlType === 'thread' ? 'threads' : 'comment'
        let key = `__express__/api/${apiType}/${parentNum}/${dataToUpdate}`

        const newBody = await Comment.find({"_id": {"$in": body}})

        memcached.set(key, newBody, 30, function(err){
            if(err)
                console.error('Error occured using memcache middleware:', err)
        })
    }
}