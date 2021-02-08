const replyRouter = require('express').Router()
const Reply = require('../models/Threads')
const Thread = require('../models/Thread')
const Threads = require('../models/Threads')

replyRouter.get('/', async(req, res) => {
    const threads = await Threads.find({})
    res.json(threads)
})

replyRouter.post('/', async(req, res) => {
    const body = req.body

    // find reply type. reply to thread? reply? solo?
    const numDocs = await Threads.countDocuments({})
    console.log('num docs:', numDocs)

    const threads = new Threads({thread: 1})
    console.log('threads:', threads)

    const reply = new Reply({
        replyText: body.replyText,
        url: body.url,
        thumbnailURL250: body.thumbnailURL250,
        thumbnailURL125: body.thumbnailURL125,
        dimensions: body.dimensions,
        date: body.date,
        filetype: body.filetype,
        postNum: await threads.countDocuments({})
    })

    const savedReply = await reply.save()
    // threads.threads = threads.threads.concat(savedThread._id)

    res.status(201).json(savedReply)
})

module.exports = replyRouter