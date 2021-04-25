const commentRouter = require('express').Router()
const { memcachedMiddleware, validMimeType, initUploadData, checkCredentials } = require('../utils/middleware')
const {
    createComment,
    getComments,
    getCommentReplies,
    deleteSpecificComments
} = require('../models/Comment')

const { upload } = require('../utils/generator')
// const { updateCache } = require('../utils/cache')

const uploadService = require('../services/upload')

commentRouter.get('/', memcachedMiddleware(6), async(req, res) => {
    getComments(res)
})

commentRouter.get('/:commentNum/replies', memcachedMiddleware(2), async(req, res) => {
    const commentNum = req.params.commentNum
    getCommentReplies(res, commentNum)
})

commentRouter.post('/', upload.any(), validMimeType, initUploadData, async(req, res) => {
    let fileData = {}
    let hasImage = false
    if(req.files.length > 0) {
        const uService = new uploadService(req.body.uploadData)
        fileData = await uService.generateFileData()
        hasImage = true
    }

    const commentData = {
        ...fileData,
        post_text: req.body.text,
        post_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        parentThread: req.body.parentThread,
        hasImage
    }

    // console.log(commentData)

    if(req.body.postType === "reply") {
        createComment(res, commentData, req.body.parent)
    }
    else {
        createComment(res, commentData, -1)
    }
})

commentRouter.delete('/multiple', checkCredentials, async(req, res, next) => {
    const commentsToDelete = req.body.postNums
    const adminUsername = req.body.payload.username

    deleteSpecificComments(res, commentsToDelete, adminUsername)
})


module.exports = commentRouter