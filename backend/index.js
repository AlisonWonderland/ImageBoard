// const config = require('./config/config')
const express = require('express')
const multer  = require('multer')
// const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const uploadService = require('./services/upload')

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer()

const isValidMime = (mimetype) => {
    if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
        return true
    else 
        return false
}

// might need to know if its a reply or op
// if file is not attached, don't even call this function. test this before mongo
app.post('/upload', upload.single('file'), async function (req, res, next) {
    // console.log(req.body.text)
    if(isValidMime(req.file.mimetype)) {
        const filetype = req.file.mimetype.substring(0, 5)
        const extension = req.file.mimetype.substring(6,)
        const filename = req.file.originalname
        const id = Date.now()

        const uService = new uploadService(filetype, extension, id, req.file.buffer, req.body.postType, filename)
        const fileData = await uService.generateFileData()
        res.json(fileData)
    }

    else 
        res.status(500).send('invalid file type')
})


app.listen(3001, () => {
    console.log('Listening on PORT 3001')
})