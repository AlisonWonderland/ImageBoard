const replyRouter = require('express').Router()
const { validMimeType, initUploadData } = require('../utils/middleware')
const Thread = require('../models/Thread')
const Comment = require('../models/Comment')

const uploadService = require('../services/upload')
const multer  = require('multer')

const upload = multer()


replyRouter.get('/', async(req, res) => {
    const comments = await Comment.find({})
        .populate('replies', { text: 1, postNum: 1 })
    res.json(comments)
})

replyRouter.post('/', upload.any(), validMimeType, initUploadData, async(req, res) => {
    const numDocs = await Thread.countDocuments({})
    const numComments = await Comment.countDocuments({})
    let parent = {}

    if(req.body.postType === "reply") {
        if(req.body.parentType === "thread") {
            parent = await Thread.find({postNum: req.body.parent})
            parent = parent[0]
        }
        else {
            parent = await Comment.find({postNum: req.body.parent})
        }
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
        postNum: numDocs + numComments + 1
    })

    const savedComment = await newComment.save()
    parent.replies = parent.replies.concat(savedComment._id)
    await parent.save()

    res.status(201).json(savedComment)
})

module.exports = replyRouter