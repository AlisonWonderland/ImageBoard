require('express-async-errors') 

const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const threadsRouter = require('./controllers/threads')
const commentRouter = require('./controllers/comment')
const authenticationRouter = require('./controllers/authentication')
const adminRouter = require('./controllers/admin')

const mysql = require('mysql')
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'imageboard',
    multipleStatements: true
});
   
db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected to mysql as id ' + db.threadId);
});

global.db = db

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