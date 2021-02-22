const config = require('../config/config')

const threadsRouter = require('express').Router()
const { validMimeType, initUploadData } = require('../utils/middleware')
const Comment = require('../models/Comment')
const Thread = require('../models/Thread')

const uploadService = require('../services/upload')
const multer  = require('multer')
const upload = multer()

threadsRouter.get('/', async(req, res) => {
    const threads = await Thread.find({})
        .populate('replies', { text: 1, postNum: 1 })
    res.json(threads)
})

threadsRouter.get('/:threadNum/replies', async(req, res) => {
    const threadNum = req.params.threadNum
    const searchedThread = await Thread.findOne({postNum: threadNum})
    const threadReplies = await Comment.find({"_id": {"$in": searchedThread.replies}})

    res.status(200).send(threadReplies)
})

threadsRouter.get('/:threadNum/comments', async(req, res) => {
    const threadNum = req.params.threadNum
    const searchedThread = await Thread.findOne({postNum: threadNum})
    const threadComments = await Comment.find({"_id": {"$in": searchedThread.comments}})

    res.status(200).send(threadComments)
})


threadsRouter.post('/', upload.single('file'), validMimeType, initUploadData, async(req, res, next) => {
    const numDocs = await Thread.countDocuments({})
    const numComments = await Comment.countDocuments({})
   
    const uService = new uploadService(req.body.uploadData)
    const fileData = await uService.generateFileData()
    
    const thread = new Thread({
        ...fileData,
        text: req.body.text,
        date: new Date(Date.now()),
        postNum: numDocs + numComments + 1
    })

    const savedThread = await thread.save()

    res.status(201).json(savedThread)
})

threadsRouter.delete('/', async(req, res, next) => {
        // console.log(req)
        console.log(config.PIN)
        if(req.body.pin === config.PIN) {
            await Thread.deleteMany({})
            console.log('threads deletion')
            res.status(200).end()
        }
    
        res.status(401).end()
})

module.exports = threadsRouter