const mongoose = require('mongoose')
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

// in the future add permissions? but it is an admin board after all
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Enter a username.'],
        unique: [true, 'That username is taken.'],
        validate: [validator.isAlphanumeric, 'Usernames may only have letters and numbers.']
    },
    password: {
        type: String,
        required: [true, 'Enter a password.'],
        minLength: [4, 'Password should be at least four characters']
    },
    refreshToken : {
        type: String
    },
    permissions: {
        type: String
    },
    commentsDeleted: {
        type: Number,
        default: 0
    },
    threadsDeleted: {
        type: Number,
        default: 0
    },
    totalPostsDeleted: {
        type: Number,
        default: 0
    },
    lastDeletionDate: {
        type: Date
    },
    settings: {
        darkMode: { 
            type: Boolean,
            default: false
        }
    }
})

adminSchema.plugin(uniqueValidator)

adminSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
