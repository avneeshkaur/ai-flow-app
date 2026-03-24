const express = require('express')
const axios = require('axios')
const Conversation = require('../models/Conversation')

const router = express.Router()

router.get('/debug', (req, res) => {
  const key = process.env.OPENROUTER_API_KEY || ''
  res.json({
    keyLength: key.length,
    keyStart: key.substring(0, 15),
    mongoSet: !!process.env.MONGO_URI
  })
})

router.post('/ask-ai', async (req, res) => {
  const { prompt } = req.body

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const result = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-mini:free',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-flow-app-one.vercel.app',
          'X-Title': 'AI Flow App'
        },
        timeout: 30000
      }
    )

    const aiText = result.data.choices[0].message.content
    res.json({ response: aiText })
  } catch (err) {
    console.log('AI call failed:', err.message)
    console.log('Response data:', err.response?.data)
    console.log('API Key present:', !!process.env.OPENROUTER_API_KEY)
    console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length)
    res.status(500).json({ error: 'AI request failed', detail: err.response?.data })
  }
})

router.post('/save', async (req, res) => {
  const { prompt, response } = req.body

  if (!prompt || !response) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    const doc = new Conversation({ prompt, response })
    await doc.save()
    res.json({ message: 'Saved', id: doc._id })
  } catch (err) {
    console.log('DB save error:', err.message)
    res.status(500).json({ error: 'Could not save' })
  }
})

router.get('/history', async (req, res) => {
  try {
    const data = await Conversation.find().sort({ savedAt: -1 })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' })
  }
})

module.exports = router
