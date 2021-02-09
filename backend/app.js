const config = require('./config/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const threadsRouter = require('./controllers/threads')

const mongoUrl = config.MONGODB_URI

logger.info('connecting to', mongoUrl)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Error:', err))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/threads', threadsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app