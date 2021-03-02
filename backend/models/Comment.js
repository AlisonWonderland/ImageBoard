const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const commentSchema = new mongoose.Schema({
    text: {
        type:String,
    },
    url: {
        type:String,
    },
    thumbnail125URL: {
        type:String,
    },
    dimensions: {
        type: Map,
        of: String,
    },
    date: {
        type:Date,
        required: true
    },
    filetype: {
        type:String,
    },
    postNum: {
        type:Number,
        required: true
    },
    hasImage: {
        type:Boolean,
    },
    parentThread: {
        type:Number,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

commentSchema.plugin(uniqueValidator)

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
