require('dotenv').config()
const express = require('express')
const path = require("path")
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const sharp = require('sharp')
const fs = require('fs')
let cloudinary = require('cloudinary').v2;
// const { exec } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

const app = express()
app.use(cors())

// exec('ffmpeg -i test.webm -s 250x250 -vf fps=1 test.jpg', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.error(`stderr: ${stderr}`);
// });

const isValidMime = (mimetype) => {
    if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
        return true
    else 
        return false
}

const getThumbnailDimensions = (width, height) => {
    const aspectRatio = width / height
    let thumbnailHeight = 250
    let thumbnailWidth = 250

    console.log('width', width)
    console.log('height', height)
    console.log('ratio:', aspectRatio)

    if(width > height) {
        thumbnailHeight = Math.floor(thumbnailHeight / aspectRatio)
        console.log('thumbnailHeight', thumbnailHeight)
    }
    else {
        thumbnailWidth = Math.floor(aspectRatio * thumbnailWidth)
        console.log('thumbnailWidth', thumbnailWidth)
    }

    return { thumbnailWidth, thumbnailHeight }
}

const upload = multer()

// test aws in here
// so much logic, might as well split up routes
app.post('/upload', upload.single('file'), async function (req, res, next) {
    if(req.file && isValidMime(req.file.mimetype)) {
        console.time('uploadSpeed')
        console.log(req.file)
        
        fs.writeFileSync('temp.webm', req.file.buffer)
        
        let vidDimensions = await exec('ffprobe -v error -select_streams v -show_entries stream=width,height -of json=compact=1 temp.webm')
        vidDimensions = JSON.parse(vidDimensions.stdout)
        // console.log('dims', vidDimensions)
        const { width, height } = vidDimensions.streams[0]
        // console.log('dims', width, height)
        const { thumbnailWidth, thumbnailHeight } = getThumbnailDimensions(width, height)

        exec(`ffmpeg -y -i temp.webm -s ${thumbnailWidth}x${thumbnailHeight} -vf fps=1 temp.jpg`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.error(`stderr: ${stderr}`);
        });


        if(req.file.mimetype === "video/webm") {
            console.timeEnd('uploadSpeed')
            res.json({ 
                url: req.file.originalname,
                thumbnailURL: req.file.originalname,
                filename: req.file.originalname,
                date: new Date(Date.now()),
                filetype: 'video',
                id: uuidv4()
            })
        }
    }
    

    else 
        res.status(500).send('invalid file type')
})


app.listen(3001, () => {
    console.log('Listening on PORT 3001')
})