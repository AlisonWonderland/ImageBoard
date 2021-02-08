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
        let uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
        uploadParams.Body = file;
        uploadParams.Key = filename + '.' + extension;
    
        const response = await s3.upload(uploadParams).promise();
        return response.Location

    }
}