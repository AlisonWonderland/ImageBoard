const config = require('../config/config')

const commentRouter = require('express').Router()
const { validMimeType, initUploadData } = require('../utils/middleware')
const Thread = require('../models/Thread')
const Comment = require('../models/Comment')

const uploadService = require('../services/upload')
const multer  = require('multer')

const upload = multer()


commentRouter.get('/', async(req, res) => {
    const comments = await Comment.find({})
        .populate('replies', { text: 1, postNum: 1 })
    res.json(comments)
})

commentRouter.get('/:commentNum/replies', async(req, res) => {
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
    if(req.files.length > 0) {
        const uService = new uploadService(req.body.uploadData)
        fileData = await uService.generateFileData()
    }

    const newComment = new Comment({
        ...fileData,
        text: req.body.text,
        date: new Date(Date.now()),
        postNum: numDocs + numComments + 1,
        parentThread: parentThreadNum
    })

    const savedComment = await newComment.save()
    if(req.body.postType === "reply") {
        parent.replies = parent.replies.concat(savedComment._id)
        await parent.save()

        if(req.body.parentType === "comment") {
            let parentThread = await Thread.findOne({postNum: parentThreadNum})
            parentThread.comments = parentThread.comments.concat(savedComment._id)
            await parentThread.save()    
        }
    }
    if(req.body.parentType === 'thread') {
        parent.comments = parent.comments.concat(savedComment._id)
        await parent.save()
    }

    res.status(201).json(savedComment)
})

commentRouter.delete('/', async(req, res, next) => {
    // console.log(req)
    console.log(config.PIN)
    if(req.body.pin === config.PIN) {
        await Comment.deleteMany({})
        console.log('comments deletion')
        res.status(200).end()
    }

    res.status(401).end()
})


module.exports = commentRouter