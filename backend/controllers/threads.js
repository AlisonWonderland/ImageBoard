const threadsRouter = require('express').Router()
// const Threads = require('../models/Threads')
const Thread = require('../models/Thread')
const uploadService = require('../services/upload')
const { validMimeType, initUploadData } = require('../utils/middleware')
const multer  = require('multer')

const upload = multer()

threadsRouter.get('/', async(req, res) => {
    const threads = await Thread.find({})
    res.json(threads)
})

// might need service here
threadsRouter.post('/', upload.single('file'), validMimeType, initUploadData, async(req, res, next) => {
    const numDocs = await Thread.countDocuments({})
    console.log('num docs:', numDocs)
   
    const uService = new uploadService(req.body.uploadData)
    const fileData = await uService.generateFileData()
    console.log(fileData)
    
    const thread = new Thread({
        ...fileData,
        text: req.body.text,
        postNum: numDocs + 1
    })

    const savedThread = await thread.save()

    res.status(201).json(savedThread)
})

module.exports = threadsRouter