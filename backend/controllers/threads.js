const threadsRouter = require('express').Router()
const { memcachedMiddleware, validMimeType, initUploadData, checkCredentials } = require('../utils/middleware')
const Comment = require('../models/Comment')
const Thread = require('../models/Thread')
const config = require('../config/config')

const uploadService = require('../services/upload')

const { upload } = require('../utils/generator')
const Admin = require('../models/Admin')

// this probably wont be called as often as the others. so caching it for 60 seconds
threadsRouter.get('/', memcachedMiddleware(6), async(req, res) => {
    const threads = await Thread.find({})
        .populate('replies', { text: 1, postNum: 1 })
    res.json(threads)
})

threadsRouter.get('/:threadNum/replies', memcachedMiddleware(2), async(req, res) => {
    const threadNum = req.params.threadNum
    const searchedThread = await Thread.findOne({postNum: threadNum})
    const threadReplies = await Comment.find({"_id": {"$in": searchedThread.replies}})

    res.status(200).send(threadReplies)
})

threadsRouter.get('/:threadNum/data', memcachedMiddleware(2), async(req, res) => {
    let data = {}
    const thread = await Thread.findOne({postNum: req.params.threadNum})
    data.numComments =  thread.numComments
    data.numImages = thread.numImages
    // console.log(data.numImages)
    // unique posters

    res.json(data)
})

threadsRouter.get('/:threadNum/comments', memcachedMiddleware(2), async(req, res) => {
    const threadNum = req.params.threadNum
    const searchedThread = await Thread.findOne({postNum: threadNum})
    const threadComments = await Comment.find({"_id": {"$in": searchedThread.comments}})

    res.status(200).send(threadComments)
})

// same thought as with '/'
threadsRouter.get('/catalogThreads', memcachedMiddleware(6), async(req, res) => {
    const threads = await Thread.find({}, {thumbnail125URL: 1, text:1, numComments: 1, numImages: 1, postNum: 1, date: 1})

    res.status(200).send(threads)
})

threadsRouter.get('/:threadNum', memcachedMiddleware(6), async(req, res) => {
    const threadNum = req.params.threadNum
    const searchedThread = await Thread.findOne({postNum: threadNum})

    res.status(200).send(searchedThread)
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

// will need JWT verification in the future

// delete all route
// there is an error with invalid deletion routes
threadsRouter.delete('/', async(req, res, next) => {
        // console.log(req)
        console.log(config.PIN, 'noo')
        if(req.body.pin === config.PIN) {
            await Thread.deleteMany({})
            console.log('threads deletion')
            res.status(200).end()
        }
    
        res.status(401).end()
})

threadsRouter.delete('/multiple', checkCredentials, async(req, res, next) => {
    const threadsToDelete = req.body.postNums
    console.log('threadsToDelete:', threadsToDelete)
    console.log('body:', req.body)

    const admin = await Admin.findOne({username: req.body.payload.username})
    admin.threadsDeleted += threadsToDelete.length
    admin.totalPostsDeleted += threadsToDelete.length
    admin.lastDeletionDate = new Date()
    await admin.save()

    console.log('admin after deletes', admin)
    
    // await Comment.deleteMany({"parentThread": {"$in": threadsToDelete}})
    // await Thread.deleteMany({"postNum": {"$in": threadsToDelete}})

    res.status(200).end()

    // res.status(401).end()
})

threadsRouter.delete('/:threadNum/', async(req, res, next) => {
    const threadNum = req.params.threadNum
    // console.log(req)
    console.log(config.PIN)
    if(req.body.pin === config.PIN) {
        await Thread.deleteOne({postNum: threadNum})
        console.log(`thread ${threadNum} deleted`)
        res.status(200).end()
    }

    res.status(401).end()
})


threadsRouter.delete('/:threadNum/comments', async(req, res, next) => {
    // console.log(req)
    const threadNum = req.params.threadNum

    console.log(config.PIN)
    if(req.body.pin === config.PIN) {
        const searchedThread = await Thread.findOne({postNum: threadNum})
        await Comment.deleteMany({"_id": {"$in": searchedThread.comments}})
    
        console.log(`thread ${threadNum} comments deleted`)
        res.status(200).end()
    }

    res.status(401).end()
})

module.exports = threadsRouter