const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const threadsSchema = new mongoose.Schema({
    id: {
        type:Number,
        default: 1
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
})

threadsSchema.plugin(uniqueValidator)

threadsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const Threads = mongoose.model('Threads', threadsSchema)

module.exports = Threads
