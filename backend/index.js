require('dotenv').config()
const express = require('express')
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const sharp = require('sharp')
const fs = require('fs')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
let AWS = require("aws-sdk")

const app = express()
app.use(cors())
const upload = multer()

AWS.config.update({region: 'us-west-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


// focus on performance later

// limits
// 4mb

const createThumbnailDimensions = (width, height) => {
    const aspectRatio = width / height
    let thumbnailHeight = 250
    let thumbnailWidth = 250

    // console.log('width', width)
    // console.log('height', height)
    // console.log('ratio:', aspectRatio)

    if(width > height) {
        thumbnailHeight = Math.floor(thumbnailHeight / aspectRatio)
        // console.log('thumbnailHeight', thumbnailHeight)
    }
    else {
        thumbnailWidth = Math.floor(aspectRatio * thumbnailWidth)
        // console.log('thumbnailWidth', thumbnailWidth)
    }

    return { thumbnailHeight, thumbnailWidth }
}

// all thumbnails are 250x250 for now
// combine get dimensions and thumbnail creation functions. return all info into an object
const createImageThumbnail = async (buffer, id) => {
    // console.log('buffer:', buffer)

    const { width, height } = await sharp(buffer).metadata()
    const { thumbnailHeight, thumbnailWidth } = createThumbnailDimensions(width, height)
    const thumbnailBuffer = await sharp(buffer).resize(thumbnailWidth, thumbnailHeight).toBuffer()

    return await uploadFile(thumbnailBuffer, id + 'thumb', 'jpg')
}

const createGifThumbnail = async (buffer, id) => {
    const { width, height } = await sharp(buffer).metadata()
    const { thumbnailHeight, thumbnailWidth } = createThumbnailDimensions(width, height)
    const thumbnailBuffer = await sharp(buffer)
        .jpeg()
        .resize(thumbnailWidth, thumbnailHeight)
        .toBuffer()

    return await uploadFile(thumbnailBuffer, id + 'thumb', 'jpg')
}

const createVideoThumbnail = async ({ height, width }, id) => {
    const { thumbnailHeight, thumbnailWidth } = createThumbnailDimensions(width, height)
    const videoFile = `${id}.webm`
    const videoThumbnail = `${id}thumb.jpg`

    try {
        await exec(`ffmpeg -y -i ${videoFile} -s ${thumbnailWidth}x${thumbnailHeight} -vf fps=1 ${videoThumbnail}`);
    }
    catch(err) {
        console.error(err)
    }

    let fileStream = fs.createReadStream(videoThumbnail);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });
    
    let uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
    uploadParams.Body = fileStream;
    uploadParams.Key = videoThumbnail;

    const response = await s3.upload (uploadParams).promise();
    // console.log('video thumbnail upload response:', response)

    fs.unlink(videoFile, (err) => {
        if (err) throw err;
        console.log(`${videoFile} was deleted`);
    })

    fs.unlink(videoThumbnail, (err) => {
        if (err) throw err;
        console.log(`${videoThumbnail} was deleted`);
    })

    return response.Location
}

// pass extension, might need to use object for params
// could use both for video and image
const uploadFile = async (buffer, id, extension) => {
    let uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
    // let filename = '.webm'; 
    uploadParams.Body = buffer;
    uploadParams.Key = id + '.' + extension;

    const response = await s3.upload (uploadParams).promise();
    // console.log('file upload response:', response)

    return response.Location
}

const handleUpload = async (buffer, id, extension, filetype) => {
    let dimensions = {}
    const url = await uploadFile(buffer, id, extension)
    let thumbnailURL = ""

    if(filetype === "image") {
        dimensions = await getImageDimensions(buffer)
    }
    else
        dimensions = await getVideoDimensions(buffer, id)


    if(filetype === "image" && extension !== "gif") {
        thumbnailURL = await createImageThumbnail(buffer, id)
    }
    else if(filetype === "image" && extension === "gif") {
        thumbnailURL = await createGifThumbnail(buffer, id)
    }
    else {
        thumbnailURL = await createVideoThumbnail(dimensions, id)
    }

    return { url, thumbnailURL, dimensions }
}

const getImageDimensions = async (buffer) => {
    const { height, width } = await sharp(buffer).metadata()
    return { height, width }
}

const getVideoDimensions = async(buffer, id) => {
    fs.writeFileSync(`${id}.webm`, buffer)
        
    let vidDimensions = await exec(`ffprobe -v error -select_streams v -show_entries stream=width,height -of json=compact=1 ${id}.webm`)
    vidDimensions = JSON.parse(vidDimensions.stdout)
    const { width, height } = vidDimensions.streams[0]
    // return can be a one liner with above i think
    return { height, width }
}

const generateFileData = async (file) => {
    const filetype = file.mimetype.substring(0, 5)
    const extension = file.mimetype.substring(6,)
    const id = Date.now()
    
    const { url, thumbnailURL, dimensions } = await handleUpload(file.buffer, id, extension, filetype)

    // return thumbnail dimensions
    return {
        url,
        thumbnailURL,
        filename: file.originalname,
        dimensions,
        date: new Date(Date.now()),
        filetype,
        id
    }
}


const isValidMime = (mimetype) => {
    if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
        return true
    else 
        return false
}

// two things, get thumbnail from webm and dimensions
// might just use fluentffmpeg

// return url and filetype in final product
// might need to know if its a reply or op
// if file is not attached, don't even call this function
app.post('/upload', upload.single('file'), async function (req, res, next) {
    // console.time('uploadSpeed')
    if(isValidMime(req.file.mimetype)) {
        const fileData = await generateFileData(req.file)
        res.json(fileData)
    }

    else 
        res.status(500).send('invalid file type')
})


app.listen(3001, () => {
    console.log('Listening on PORT 3001')
})