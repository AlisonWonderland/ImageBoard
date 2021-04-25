const threadsRouter = require('express').Router()
const { memcachedMiddleware, validMimeType, initUploadData, checkCredentials } = require('../utils/middleware')
const { 
    getThreads, 
    createThread ,
    getThreadReplies,
    getThreadData,
    getThreadComments,
    getCatalogThreads,
    getThread,
    deleteSpecificThreads
} = require('../models/Thread')

const uploadService = require('../services/upload')

const { upload } = require('../utils/generator')

threadsRouter.get('/', memcachedMiddleware(2), (req, res) => {
    getThreads(res)
})


// TODO TEST, look at postman response
threadsRouter.get('/:threadNum/replies', memcachedMiddleware(2), (req, res) => {
    const threadNum = req.params.threadNum
    getThreadReplies(res, threadNum)
})

threadsRouter.get('/:threadNum/data', memcachedMiddleware(2), (req, res) => {
    const threadNum = req.params.threadNum
    getThreadData(res, threadNum)
})

threadsRouter.get('/:threadNum/comments', memcachedMiddleware(2), (req, res) => {
    const threadNum = req.params.threadNum
    getThreadComments(res, threadNum)
})

threadsRouter.get('/catalogThreads', memcachedMiddleware(2), (req, res) => {
    getCatalogThreads(res)
})

threadsRouter.get('/:threadNum', memcachedMiddleware(2), (req, res) => {
    const threadNum = req.params.threadNum
    getThread(res, threadNum)
})


threadsRouter.post('/', upload.single('file'), validMimeType, initUploadData, async(req, res, next) => {   
    const uService = new uploadService(req.body.uploadData)
    const fileData = await uService.generateFileData()

    const threadData = {
        ...fileData,
        post_text: req.body.text,
        post_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    createThread(res, threadData)
})


threadsRouter.delete('/multiple', checkCredentials, async(req, res, next) => {
    const threadsToDelete = req.body.postNums
    const adminUsername = req.body.payload.username
    deleteSpecificThreads(res, threadsToDelete, adminUsername)
})

module.exports = threadsRouter