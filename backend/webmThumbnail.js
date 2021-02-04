require('dotenv').config()
const express = require('express')
const path = require("path")
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const sharp = require('sharp')
const fs = require('fs')
// const { exec } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
let AWS = require("aws-sdk");

AWS.config.update({region: 'us-west-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const app = express()
app.use(cors())
const upload = multer()

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


// test aws in here
// so much logic, might as well split up routes
app.post('/upload', upload.single('file'), async function (req, res, next) {
    if(req.file && isValidMime(req.file.mimetype)) {
        console.log(req.file)
        
        fs.writeFileSync('temp.webm', req.file.buffer)
        
        let vidDimensions = await exec('ffprobe -v error -select_streams v -show_entries stream=width,height -of json=compact=1 temp.webm')
        vidDimensions = JSON.parse(vidDimensions.stdout)
        
        const { width, height } = vidDimensions.streams[0]
        const { thumbnailWidth, thumbnailHeight } = getThumbnailDimensions(width, height)

        exec(`ffmpeg -y -i temp.webm -s ${thumbnailWidth}x${thumbnailHeight} -vf fps=1 temp.jpg`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.error(`stderr: ${stderr}`);
        });

        let uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
        let file = 'temp.webm';

        let fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });

        uploadParams.Body = fileStream;
        uploadParams.Key = Date.now() + '.webm';

            // call S3 to retrieve upload file to specified bucket
        s3.upload (uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            } if (data) {
                console.log('data:', data)
                console.log("Upload Success", data.Location);
            }
        });

        if(req.file.mimetype === "video/webm") {
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
        res.status(500).send('Invalid file type')
})


app.listen(3001, () => {
    console.log('Listening on PORT 3001')
})