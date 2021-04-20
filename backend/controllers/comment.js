const commentRouter = require('express').Router()
const { memcachedMiddleware, validMimeType, initUploadData, checkCredentials } = require('../utils/middleware')
const Thread = require('../models/Thread')
const Comment = require('../models/Comment')
const Admin = require('../models/Admin')
const config = require('../config/config')
const ObjectId = require('mongodb').ObjectID;

const { upload } = require('../utils/generator')
const { updateCache } = require('../utils/cache')

const uploadService = require('../services/upload')

commentRouter.get('/', memcachedMiddleware(6), async(req, res) => {
    console.log('url', req.originalUrl)

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

// this could use a performance boost
// maybe pass in parentThread from front end?
// but that will only work after threads are all reset

// commenting out .save() calls for testing purposes
commentRouter.delete('/multiple', checkCredentials, async(req, res, next) => {
    console.log('body:', req.body)
    const commentsToDelete = req.body.postNums
    console.log('commentsTo:', commentsToDelete)

    // Got to fetch comments to get ids and remove them from parent threads
    const comments = await Comment.find({"postNum": {"$in": commentsToDelete}})
    let parentThread = {}
    
    for(let i = 0; i < comments.length; ++i) {
        parentThread = await Thread.findOne({"postNum": comments[i].parentThread})

        parentThread.comments = parentThread.comments.filter(comment => !comment.equals(comments[i]._id))
        parentThread.replies = parentThread.replies.filter(reply => !reply.equals(comments[i]._id))

        console.log('comments length', parentThread.comments.length)
        console.log('reply length', parentThread.replies.length)
        // await parentThread.save()
    }


    const admin = await Admin.findOne({username: req.body.payload.username})
    admin.commentsDeleted += commentsToDelete.length
    admin.totalPostsDeleted += commentsToDelete.length
    admin.lastDeletionDate = new Date()
    // await admin.save()

    console.log('admin after deletes', admin)

    // await Comment.deleteMany({"postNum": {"$in": commentsToDelete}})
    res.status(200).end()
})


module.exports = commentRouter