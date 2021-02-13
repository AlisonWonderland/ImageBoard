const Thread = require('../models/Thread')
const Comment = require('../models/Comment')

const initComments = () => {
    const comments = [
        {

        }
    ]

    return comments
}

const initialThreads = () => {
    const threads = [
        {
            text: 'the first post. I love twice!',
            url: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947.jpeg',
            thumbnail250URL: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947thumb250.jpg',
            thumbnail125URL: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947thumb125.jpg',
            dimensions: {
                height: '960',
                width: '1121'
            },
            date: new Date(Date.now()),
            filetype: 'image',
            filename: 'jeongers crying',
            id: '1612935969947',
            postNum: 1
        },
        {
            text: 'the second post. I love iz*one!',
            url: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947.jpeg',
            thumbnail250URL: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947thumb250.jpg',
            thumbnail125URL: 'https://photoboardbucket.s3-us-west-1.amazonaws.com/1612935969947thumb125.jpg',
            dimensions: {
                height: '960',
                width: '1121'
            },
            date: new Date(Date.now()),
            filetype: 'image',
            filename: 'jeongers crying',
            id: '1612935969947',
            postNum: 2
        }
    ]
    return threads
}

module.exports = {
    initialThreads
}