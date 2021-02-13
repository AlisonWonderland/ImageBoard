const logger = require('../utils/logger')
const awsService = require('./aws')
const sharp = require('sharp')
const fs = require('fs')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

// use this in controllers?
// setDimensions?
class UploadService {
    constructor({ filetype, extension, id, buffer, postType, filename }) {
        this.filetype = filetype
        this.extension = extension
        this.id = id
        this.buffer = buffer
        this.postType = postType
        this.filename = filename
    }

    async generateFileData() {
        const url = await this.uploadFile(this.buffer, this.id, this.extension)
        let thumbnail250URL = ""
        let thumbnail125URL = ""
        let dimensions = {}

        // return dimensions
        if(this.postType === "thread") {
            if(this.filetype === "image")
                [ dimensions, thumbnail125URL, thumbnail250URL ] = await this.createImageThumbnail()
            else
                [ dimensions, thumbnail125URL, thumbnail250URL ] = await this.createVideoThumbnail()
        }
        else {
            if(this.filetype === "image")
                [ dimensions, thumbnail125URL ] = await this.createImageThumbnail()
            else
                [ dimensions, thumbnail125URL ] = await this.createVideoThumbnail()
        }
    
        // extension needed? extension: this.extension
        let data = {
            url: url,
            filetype: this.filetype,
            id: this.id,
            dimensions: dimensions,
            filename: this.filename
        }

        if(this.postType === "thread"){
            data = { ...data, thumbnail125URL, thumbnail250URL }
        }
        else {
            data = { ...data, thumbnail125URL }
        }

        return data    
    }

    async uploadFile(file, filename, extension) {
       return await awsService.uploadToS3(file, filename, extension)
    }

    async getImageDimensions(sharpBuffer) {
        const { height, width } = await sharpBuffer.metadata()
        return { height, width }
    }
    
    async getVideoDimensions(buffer, videoFile) {
        fs.writeFileSync(videoFile, buffer)
        
        try {
            let vidDimensions = await exec(`ffprobe -v error -select_streams v -show_entries stream=width,height -of json=compact=1 ${videoFile}`)
            vidDimensions = JSON.parse(vidDimensions.stdout)
            const { width, height } = vidDimensions.streams[0]
                        
            return { height, width }
    
        }
        catch(err) {
            console.log(err)
        }
        return { height: 0, width: 0 }
    }

    createThumbnailDimensions({width, height}, maxHeight, maxWidth) {
        const aspectRatio = width / height
        let thumbnailHeight = maxHeight
        let thumbnailWidth = maxWidth

        if(width > height) {
            thumbnailHeight = Math.floor(thumbnailHeight / aspectRatio)
        }
        else {
            thumbnailWidth = Math.floor(aspectRatio * thumbnailWidth)
        }
    
        return { thumbnailHeight, thumbnailWidth }
    }

    /*
        UGLY code ahead!
    */
    
    async createImageThumbnail() {
        let thumbnail250Dimensions = 0
        let thumbnail125URL, thumbnail250URL = ""
        
        let sharpBuffer = await sharp(this.buffer)
        const dimensions = await this.getImageDimensions(sharpBuffer)
        const thumbnail125Dimensions = this.createThumbnailDimensions(dimensions, 125, 125)
        
        if(this.extension === "gif")
            sharpBuffer = await sharpBuffer.jpeg()
                
        const thumbnail125Buffer = await sharpBuffer.resize(thumbnail125Dimensions.thumbnailWidth, thumbnail125Dimensions.thumbnailHeight).toBuffer()
        thumbnail125URL = await this.uploadFile(thumbnail125Buffer, this.id + 'thumb125', 'jpg')

        if(this.postType === "thread") {
            thumbnail250Dimensions = this.createThumbnailDimensions(dimensions, 250, 250)
            const thumbnail250Buffer = await sharpBuffer.resize(thumbnail250Dimensions.thumbnailWidth, thumbnail250Dimensions.thumbnailHeight).toBuffer()
            thumbnail250URL = await this.uploadFile(thumbnail250Buffer, this.id + 'thumb250', 'jpg')
        }

        return [dimensions, thumbnail125URL, thumbnail250URL]
    }
        
     async createVideoThumbnail() {
        const videoFile = `${this.id}.webm`
        const videoThumbnail125 = `${this.id}thumb125.jpg`
        let videoThumbnail250 = ''
    
        const dimensions = await this.getVideoDimensions(this.buffer, videoFile)
        const t125 = this.createThumbnailDimensions(dimensions, 125, 125)

        try {
            await exec(`ffmpeg -y -i ${videoFile} -s ${t125.thumbnailWidth}x${t125.thumbnailHeight} -vf fps=1 ${videoThumbnail125}`);
            
        }
        catch(err) {
            console.error(err)
        }

        if(this.postType === "thread") {
            try {
                videoThumbnail250 = `${this.id}thumb250.jpg`
                const t250 = this.createThumbnailDimensions(dimensions, 250, 250)
                await exec(`ffmpeg -y -i ${videoFile} -s ${t250.thumbnailWidth}x${t250.thumbnailHeight} -vf fps=1 ${videoThumbnail250}`);    
            }
            catch(err) {
                console.error(err)
            }
        }
    
        let fileStream = fs.createReadStream(videoThumbnail125);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        const thumbnail125URL = await awsService.uploadToS3(fileStream, `${this.id}thumb125`, 'jpg')

        let thumbnail250URL = ""
        if(this.postType === "thread") {
            fileStream = fs.createReadStream(videoThumbnail250);
            fileStream.on('error', function(err) {
                console.log('File Error', err);
            });
            thumbnail250URL = await awsService.uploadToS3(fileStream, `${this.id}thumb250`, 'jpg')
        }

        this.deleteVideoFiles(videoFile, videoThumbnail125, videoThumbnail250)
    
        return [dimensions, thumbnail125URL, thumbnail250URL]
    }

    deleteVideoFiles(videoFile, videoThumbnail125, videoThumbnail250) {
        fs.unlink(videoFile, (err) => {
            if (err) throw err;
            logger.info(`${videoFile} was deleted`);
        })
    
        fs.unlink(videoThumbnail125, (err) => {
            if (err) throw err;
            logger.info(`${videoThumbnail125} was deleted`);
        })

        if(videoThumbnail250 !== "") {
            fs.unlink(videoThumbnail250, (err) => {
                if (err) throw err;
                logger.info(`${videoThumbnail250} was deleted`);
            })
        }
    }
}

module.exports = UploadService