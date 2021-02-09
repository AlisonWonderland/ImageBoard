const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const validMimeType = (req, res, next) => {
    const mimetype = req.file.mimetype
    if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
        next()
    else 
        res.status(400).send({ error: 'Invalid file format' })

}

const initUploadData = (req, res, next) => {
    if(req.file) {
        req.body = {
            ...req.body,
            uploadData: {
                filetype: req.file.mimetype.substring(0, 5),
                extension: req.file.mimetype.substring(6,),
                id: Date.now(),
                buffer: req.file.buffer,
                postType: req.body.postType,
                filename: req.file.originalname,
            }
        }
    }

    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    requestLogger,
    validMimeType,
    initUploadData,
    unknownEndpoint,
    errorHandler
}