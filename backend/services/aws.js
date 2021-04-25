const config = require('../config/config')
let AWS = require("aws-sdk")

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
    region: config.AWS_REGION
});


module.exports = {
    uploadToS3: async function(file, filename, extension) {
        let mimetype = ''

        // have to do this because thumbnails are being passed through here
        // and their mimetypes aren't stored in uploadService
        if(extension !== 'webm') {
            mimetype = `image/${extension}`
        }
        else {
            mimetype = 'video/webm'
        }

        let uploadParams = {
            Bucket: 'photoboardbucket', 
            Key: filename + '.' + extension, 
            Body: file, 
            ContentType: mimetype,
            CacheControl: 'public, max-age=3600'
        };
    
        const response = await s3.upload(uploadParams).promise();
        return response.Location

    }
}