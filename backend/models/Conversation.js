const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
})

const Conversation = mongoose.model('Conversation', schema)
module.exports = Conversation
