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

// might need service here
threadsRouter.post('/', upload.single('file'), validMimeType, initUploadData, async(req, res, next) => {
    const numDocs = await Thread.countDocuments({})
    const numComments = await Comment.countDocuments({})
    console.log('num docs:', numDocs)
   
    const uService = new uploadService(req.body.uploadData)
    const fileData = await uService.generateFileData()
    // console.log(fileData)
    
    const thread = new Thread({
        ...fileData,
        text: req.body.text,
        date: new Date(Date.now()),
        postNum: numDocs + numComments + 1
    })

    const savedThread = await thread.save()

    res.status(201).json(savedThread)
})

module.exports = threadsRouter