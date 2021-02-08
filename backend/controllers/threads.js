const threadsRouter = require('express').Router()
const Threads = require('../models/Threads')
const Thread = require('../models/Thread')

threadsRouter.get('/', async(req, res) => {
    const threads = await Threads.find({})
    res.json(threads)
})

// might need service here
threadsRouter.post('/', async(req, res) => {
    const body = req.body

    const numDocs = await Threads.countDocuments({})
    console.log('num docs:', numDocs)

    const threads = new Threads({id: 1})
    console.log('threads:', threads)

    const thread = new Thread({
        title: body.title,
        url: body.url,
        thumbnailURL250: body.thumbnailURL250,
        thumbnailURL125: body.thumbnailURL125,
        dimensions: body.dimensions,
        date: body.date,
        filetype: body.filetype,
        postNum: await threads.countDocuments({})
    })

    const savedThread = await thread.save()
    threads.threads = threads.threads.concat(savedThread._id)

    res.status(201).json(savedThread)
})

module.exports = threadsRouter