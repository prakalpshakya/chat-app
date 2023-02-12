const express = require('express')
const Message = require('../models/message')
const router = new express.Router()

// GET /messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({})

    res.send(messages)
  } catch (e) {
    res.send(e)
  }
})

router.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body)
    await message.save()
    const io = req.app.get('socketio')
    io.emit('message', req.body)
    res.send(message)
  } catch (e) {
    res.send(e)
  }
})

module.exports = router
