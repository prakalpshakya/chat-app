const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    filename: {
      type: String,
    },
    filetype: {
      type: String,
    },
  },

  // doc: {
  //   type: Buffer,
  // },
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
