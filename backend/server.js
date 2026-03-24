require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: '*'
}))
app.use(express.json())

const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.send('Server is up')
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('MongoDB connection failed:', err.message)
    process.exit(1)
  })
