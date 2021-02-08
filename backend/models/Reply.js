const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const replySchema = new mongoose.Schema({
    replyText: {
        type:String,
    },
    url: {
        type:String,
    },
    thumbnailURL250: {
        type:String,
    },
    thumbnailURL125: {
        type:String,
    },
    dimensions: {
        type:String,
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
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
})

replySchema.plugin(uniqueValidator)

replySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply
