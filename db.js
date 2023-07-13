const mongoose = require('mongoose')
const mongoURI = process.env.DATABASE || 'mongodb://127.0.0.1:27017/tholu'

const connectToMongo = async () => {
  mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(() => {
    console.log('>>>>    Connected to Mongo successfully!')
  }).catch((err) => {
    console.log(err)
  })
}

module.exports = connectToMongo
