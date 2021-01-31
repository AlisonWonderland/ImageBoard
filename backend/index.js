require('dotenv').config()
const express = require('express')
const path = require("path")
const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
const sharp = require('sharp')
const fs = require('fs')
let cloudinary = require('cloudinary').v2;

const app = express()
app.use(cors())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// focus on performance later

// limits
// 4mb

// sharp('0.jpg')
//     .metadata()
//     .then(({ width, height}) => {
//         const aspectRatio = width / height
//         let resizedHeight = 250
//         let resizedWidth = 250

//         console.log('height', height)
//         console.log('width', width)
//         console.log('ratio:', aspectRatio)

//         if(width > height) {
//             resizedHeight = Math.floor(resizedHeight / aspectRatio)
//             console.log('resizedHeight', resizedHeight)
//         }
//         else {
//             resizedWidth = Math.floor(aspectRatio * resizedWidth)
//             console.log('resizedWidth', resizedWidth)
//         }

//         sharp('0.jpg')
//             .resize(resizedWidth, resizedHeight)
//             .toFile('0thumb.jpg')
//             .then(info => {
//                 console.log('info', info)
//             })
//             .catch(err => {
//                 console.log('error occured')
//             })
//     })

// combine get dimensions and thumbnail creation functions. return all info into an object
const createThumbnail = (file) => {
    console.log('file', file)
    sharp(file.buffer)
        .metadata()
        .then(({ width, height }) => {
            // logic here can be turned into getThumbnailDimensions
            const aspectRatio = width / height
            let resizedHeight = 250
            let resizedWidth = 250

            console.log('width', width)
            console.log('height', height)
            console.log('ratio:', aspectRatio)

            if(width > height) {
                resizedHeight = Math.floor(resizedHeight / aspectRatio)
                console.log('resizedHeight', resizedHeight)
            }
            else {
                resizedWidth = Math.floor(aspectRatio * resizedWidth)
                console.log('resizedWidth', resizedWidth)
            }

            //end here for thumbnaildim

            sharp(file.buffer)
                .resize(resizedWidth, resizedHeight)
                .toFile('thumb.jpg')
                .then(info => {
                    console.log('info', info)
                })
                .catch(err => {
                    console.log('error occured')
                })
        })
        .catch(err => {
            console.log('error occured in processing fileBinary', err)
        })
}

const getDimensions = async (file) => {
    const metadata = await sharp(file.buffer)
                                .metadata()
    const { height, width } = metadata
    return { height, width }
}

const cloudStoreRegImage = async (file) => {
    console.log('trying upload')

    try {
        return new Promise((resolve, reject) => {

            let stream = cloudinary.uploader.upload_stream(
        
              (error, result) => {
        
                if (result) {
        
                  resolve(result);
        
                } else {
        
                  reject(error);
        
                }
        
              }
        
            );
        
            fs.createReadStream(file.buffer).pipe(stream);
        
          });
        // let cloudResponse = ''
        // const response = await cloudinary.uploader.upload_stream(function(error, result) {
        //         console.log(error);
        //         console.log(result);
        //         cloudResponse = result
        //     })
        
        // let file_reader = fs.createReadStream(file.buffer).pipe(response);
        // // use file_reader to read data? https://github.com/cloudinary/cloudinary_npm/issues/276
        // // assigning to response should've updated cloudResponse maybe? no it wouldn't
        // console.log('---cloud response', cloudResponse, '+++')
        // console.log('--+response', file_reader, '+++')
    }
    catch(err) {
        console.log(err)
    }
}

const isValidMime = (mimetype) => {
    if(mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/gif" || mimetype === "video/webm")
        return true
    else 
        return false
}

// const DIR = './public/'

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' +file.originalname )
//   }
// })

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true)
//         } else {
//             cb(null, false)
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
//         }
//     }
// })

// find out if the other way from the docs work

// const upload = multer({ storage: storage }).single('file')

// app.post('/upload',function(req, res) {
     
//     upload(req, res, function (err) {
//            if (err instanceof multer.MulterError) {
//                return res.status(500).json(err)
//            } else if (err) {
//                return res.status(500).json(err)
//            }
//       return res.status(200).send(req.file)

//     })

// });

const upload = multer()

// two things, get thumbnail from webm and dimensions
// might just use fluentffmpeg

// return url and filetype in final product
// might need to know if its a reply or op
// if file is not attached, don't even call this function
app.post('/upload', upload.single('file'), async function (req, res, next) {
    // console.time('uploadSpeed')
    if(isValidMime(req.file.mimetype)) {
        // might need to get dimensions another way for vid
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
        else {
            // const waitForUpload = await cloudStoreRegImage(req.file)
            // console.log('file at upload', req.file)
            // console.log('upload response:', waitForUpload)
            // console.timeEnd('uploadSpeed')

            res.json({ 
                url: req.file.originalname,
                thumbnailURL: req.file.originalname,
                filename: req.file.originalname,
                dimensions: await getDimensions(req.file),
                date: new Date(Date.now()),
                filetype: 'image',
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