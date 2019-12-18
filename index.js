const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        console.log('Database connection to MONGODB.')
    })
    .catch((error) => {
        console.log('Error connecting to MONGODB: ', error.message)
    })

app.use(cors())
app.use(bodyParser.json())

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})