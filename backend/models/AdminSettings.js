const mongoose = require('mongoose')
// const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

// in the future add permissions? but it is an admin board after all
const adminSettingsSchema = new mongoose.Schema({
    darkMode: {
        type: Boolean
    }
})

adminSettingsSchema.plugin(uniqueValidator)

adminSettingsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
    }
})

const AdminSettings = mongoose.model('Admin', adminSettingsSchema)

module.exports = AdminSettings
