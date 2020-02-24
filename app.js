const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        logger.info('Database connection to MONGODB.')
    })
    .catch((error) => {
        logger.error('Error connecting to MONGODB: ', error.message)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// Run this only in test mode
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

app.get('/', (req, res) => {
    res.send('Hello server')
})

module.exports = app