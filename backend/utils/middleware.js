const logger = require('./logger')
const { handleDuplicateKeyError, handleValidationError } = require('./errorHandlers')
const { memcached } = require('./generator')


let memcachedMiddleware = (duration) => {
    return  (req,res,next) => {
        let key = "__express__" + req.originalUrl || req.url;
        memcached.get(key, function(err,data){
            if(data){
                res.send(data);
                return;
            }else{
                res.sendResponse = res.send;
                res.send = (body) => {
                    memcached.set(key, body, (duration*10), function(err){
                        if(err)
                            console.error('Error occured using memcache middleware:', err)
                    });
                    res.sendResponse(body);
                }
                next();
            }
        });
    }
}

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

// thread will always include a picture
const validMimeType = (req, res, next) => {
    const file = req.file ? req.file : req.files[0]

    if(!file && req.body.postType !== "thread") {
        console.log('no file')
        next()
    }
    else {
        const mimetype = file.mimetype
        console.log(mimetype)
        if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
            next()
        else 
            res.status(400).send({ error: 'Invalid file format' })
    }


}

const initUploadData = (req, res, next) => {
    const file = req.file ? req.file : req.files[0]

    if(file) {
        req.body = {
            ...req.body,
            uploadData: {
                mimetype: file.mimetype,
                id: Date.now(),
                buffer: file.buffer,
                postType: req.body.postType,
                filename: file.originalname,
            }
        }
    }

    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return handleValidationError(error, res)
    }
    else if(error.code && error.code == 11000) 
        return handleDuplicateKeyError(error, res)
    
    res.status(500).send('An unknown error occurred.');

    next(error)
}

module.exports = {
    memcachedMiddleware,
    requestLogger,
    validMimeType,
    initUploadData,
    unknownEndpoint,
    errorHandler
}