const commentRouter = require('express').Router()
const { memcachedMiddleware, validMimeType, initUploadData } = require('../utils/middleware')
const Thread = require('../models/Thread')
const Comment = require('../models/Comment')
const config = require('../config/config')

const { upload } = require('../utils/generator')
const { updateCache } = require('../utils/cache')

const uploadService = require('../services/upload')

commentRouter.get('/', memcachedMiddleware(6), async(req, res) => {
    const comments = await Comment.find({})
        .populate('replies', { text: 1, postNum: 1 })
    res.json(comments)
})

commentRouter.get('/:commentNum/replies', memcachedMiddleware(2), async(req, res) => {
    const commentNum = req.params.commentNum
    const searchedComment = await Comment.findOne({postNum: commentNum})
    const commentReplies = await Comment.find({"_id": {"$in": searchedComment.replies}})

    res.status(200).send(commentReplies)
})

commentRouter.post('/', upload.any(), validMimeType, initUploadData, async(req, res) => {
    const numDocs = await Thread.countDocuments({})
    const numComments = await Comment.countDocuments({})
    let parent = {}
    let parentThreadNum = 0

    if(req.body.parentType === "thread") {
        parent = await Thread.findOne({postNum: req.body.parent})
        parentThreadNum = req.body.parent
    }
    else {
        parent = await Comment.findOne({postNum: req.body.parent})
        parentThreadNum = parent.parentThread
    }

    let fileData = {}
    let hasImage = false
    if(req.files.length > 0) {
        const uService = new uploadService(req.body.uploadData)
        fileData = await uService.generateFileData()
        hasImage = true
    }

    const newComment = new Comment({
        ...fileData,
        text: req.body.text,
        date: new Date(Date.now()),
        postNum: numDocs + numComments + 1,
        parentThread: parentThreadNum,
        hasImage
    })

    const savedComment = await newComment.save()
    if(req.body.postType === "reply") {
        parent.replies = parent.replies.concat(savedComment._id)
        await parent.save()

        await updateCache(parent.replies, req.body.parentType, req.body.parent, 'replies')
        // memcached.set()

        // need to attach reply to the parent threads comments
        if(req.body.parentType === "comment") {
            let parentThread = await Thread.findOne({postNum: parentThreadNum})
            parentThread.comments = parentThread.comments.concat(savedComment._id)
            parentThread.numComments += 1
            if(hasImage)
                parentThread.numImages += 1
            
            await updateCache(parentThread.comments, 'thread', parentThreadNum, 'comments')

            await parentThread.save()    
        }
    }
    if(req.body.parentType === 'thread') {
        parent.comments = parent.comments.concat(savedComment._id)
        parent.numComments += 1
        if(hasImage)
            parent.numImages += 1

        await updateCache(parent.comments, req.body.parentType, req.body.parent, 'comments')

        await parent.save()
    }

    res.status(201).json(savedComment)
})

commentRouter.delete('/multiple', async(req, res, next) => {
    const commentsToDelete = req.body
    console.log('commentsTo:', commentsToDelete)
    // await Thread.deleteMany({"postNum": {"$in": commentsToDelete}})
    res.status(200).end()

    // res.status(401).end()
})


module.exports = commentRouter