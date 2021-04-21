const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const threadSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true
    },
    url: {
        type:String,
        required: true
    },
    thumbnail250URL: {
        type:String,
        required: true
    },
    thumbnail125URL: {
        type:String,
        required: true
    },
    dimensions: {
        type: Map,
        of: String,
        required: true
    },
    date: {
        type:Date,
        required: true
    },
    filetype: {
        type:String,
        required: true
    },
    filename: {
        type:String,
        required: true
    },
    id: {
        type:String,
        required: true
    },
    postNum: {
        type:Number,
        required: true
    },
    numComments: {
        type: Number,
        default: 0
    },
    numImages: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

threadSchema.plugin(uniqueValidator)

threadSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const Thread = mongoose.model('Thread', threadSchema)

module.exports = {
    Thread,
    getThreads: (res) => {
        let query = "SELECT * FROM threads;"
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                res.json(results)
            }
        })
    },
    getThreadReplies: (res, threadNum) => {
        let query = `SELECT replies FROM threads WHERE post_num = ${threadNum};`
        
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                if(results[0].replies === null) {
                    res.json([])
                }
                else {
                    /// needs to be changed in frontend algong with comments
                    res.json(results)
                }
            }
        })
    },
    getThreadData: (res, threadNum) => {
        let query = `SELECT num_images, num_comments FROM threads WHERE post_num = ${threadNum};`

        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                res.json(results[0])
            }
        })
    },
    getThreadComments: (res, threadNum) => {
        let query = `SELECT comments FROM threads WHERE post_num = ${threadNum};`

        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                if(results[0].comments === null) {
                    res.json([])
                }
                else {
                    res.json(results)
                }
            }
        }) 
    },
    getCatalogThreads: (res) => {
        let query = `SELECT thumbnail125URL, post_text, num_comments, num_images, post_num, post_date FROM threads;`

        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                res.json(results)
            }
        }) 
    },
    getThread: (res, threadNum) => {
        let query = `SELECT * FROM threads WHERE post_num = ${threadNum};`
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
            else {
                // console.log(results)
                res.json(results[0])
            }
        })
    },
    deleteAllThreads: (res) => {
        let query = `DELETE FROM threads;`
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
        })
    },
    deleteSpecificThreads: (res, threadNums) => {
        let query = `DELETE FROM threads WHERE post_num IN (${threadNums}));`
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
        })
    },
    deleteSpecificThread: (res, threadNum) => {
        let query = `DELETE FROM threads WHERE post_num = (${threadNum}));`
        db.query(query, (err, results) => {
            if(err) {
                throw Error(err)
            }
        })
    },
    createThread: (res, threadData) => {
        const countPosts = `SELECT(SELECT COUNT(*) FROM threads) + (SELECT COUNT(*) FROM comments) as total_posts;`

        db.query(countPosts, (err, results) => {
            if(err) {
                throw Error('Error counting posts')
            }
            else {
                threadData.post_num = results[0].total_posts + 1
                // console.log(results)
                let addThread = `INSERT INTO threads (
                        post_num, 
                        post_text,
                        post_url,
                        thumbnail125URL,
                        thumbnail250URL,
                        post_dimensions,
                        post_date,
                        filetype,
                        post_filename,
                        post_id
                    )
                    VALUES
                    (
                        ${threadData.post_num}, 
                        '${threadData.post_text}',
                        '${threadData.post_url}',
                        '${threadData.thumbnail125URL}',
                        '${threadData.thumbnail250URL}',
                        '${threadData.post_dimensions}',
                        '${threadData.post_date}',
                        '${threadData.filetype}',
                        '${threadData.post_filename}',
                        '${threadData.post_id}'
                    );
                `
                db.query(addThread, (err, results) => {
                    if(err) {
                        throw Error(err) 
                    }
                    else {
                        res.status(201).json(threadData)
                    }
                })
            }
        })
    }
}