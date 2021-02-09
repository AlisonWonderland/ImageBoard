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
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
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

module.exports = Thread
