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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(undefined, 'public/docs')
  },
  filename: (req, file, cb) => {
    const extArray = file.mimetype.split('/')
    const ext = extArray[extArray.length - 1]
    cb(null, Date.now() + '.' + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Please upload a Image or PDF'))
    }

    cb(undefined, true)
  },
})

router.post('/messages', upload.single('doc'), async (req, res) => {
  try {
    const message = new Message(req.body)

    if (req.file !== undefined) {
      message.file.filename = req.file.filename

      if (req.file.mimetype.includes('image')) {
        message.file.filetype = 'image'
      } else {
        message.file.filetype = 'pdf'
      }
    }

    await message.save()
    const io = req.app.get('socketio')
    io.emit('message', message)
    res.send(message)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
