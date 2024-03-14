require('dotenv').config()

const PORT = process.env.PORT || 3003
let MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://felipeheide7:pranete2022@cluster0.odqflrg.mongodb.net/?retryWrites=true&w=majority"
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}
module.exports = {
  MONGODB_URI,
  PORT
}