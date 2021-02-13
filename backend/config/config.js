require('dotenv').config()

const PORT = process.env.PORT
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_REGION = process.env.AWS_REGION
const MONGODB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

module.exports = {
    PORT,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    MONGODB_URI
}