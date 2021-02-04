let AWS = require("aws-sdk");
require('dotenv').config()

console.time('configTime')
AWS.config.update({region: 'us-west-1'});


const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// call S3 to retrieve upload file to specified bucket
let uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
let file = 'temp.webm';

// Configure the file stream and obtain the upload parameters
let fs = require('fs');
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

  
console.timeEnd('configTime')