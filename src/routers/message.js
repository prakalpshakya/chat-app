const express = require('express')
const Message = require('../models/message')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

// GET /messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({})

    res.send(messages)
  } catch (e) {
    res.send(e)
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a Image'))
    }

    cb(undefined, true)
  },
})

router.post('/messages', upload.single('doc'), async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()

    const message = new Message(req.body)
    message.doc = buffer

    await message.save()
    const io = req.app.get('socketio')
    io.emit('message', message)
    res.send(message)
  } catch (e) {
    res.send(e)
  }
})

module.exports = router
