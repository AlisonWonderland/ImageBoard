let AWS = require("aws-sdk");
require('dotenv').config()

// let myConfig = new AWS.Config({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

console.time('configTime')
AWS.config.update({region: 'us-west-1'});

// AWS.config.getCredentials(function(err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//     console.log("Region: ", AWS.config.region);
//   }
// });


const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// call S3 to retrieve upload file to specified bucket
var uploadParams = {Bucket: 'photoboardbucket', Key: '', Body: ''};
var file = 'temp.webm';

// Configure the file stream and obtain the upload parameters
var fs = require('fs');
var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
    console.log('File Error', err);
});

uploadParams.Body = fileStream;
var path = require('path');
uploadParams.Key = path.basename(file);

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