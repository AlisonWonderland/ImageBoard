require('express-async-errors') 

const config = require('./config/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const threadsRouter = require('./controllers/threads')
const commentRouter = require('./controllers/comment')
const authenticationRouter = require('./controllers/authentication')
const adminRouter = require('./controllers/admin')

const mongoUrl = config.MONGODB_URI

logger.info('connecting to', mongoUrl)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('Error:', err))

// need to figure out which ones to use
app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded());
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))
// app.use(middleware.requestLogger)

app.use('/api/threads', threadsRouter)
app.use('/api/comment', commentRouter)
app.use('/api/authentication', authenticationRouter)
app.use('/api/admin', adminRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app