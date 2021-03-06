const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const config = require('./config/config')
const PORT = process.env.PORT || config.PORT
const { seedPackages } = require('./lib/db_seeds')

console.log('DB_URL: ', config.DB_URL)

mongoose.connect(config.DB_URL, { useNewUrlParser: true })
mongoose.Promise = global.Promise
mongoose.set('debug', true)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

const app = new express()

app.use(bodyParser.json({ limit: '192mb' }))
app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(cors())

seedPackages()

require('./routes/auth_routes')(app)
require('./routes/order_routes')(app)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

module.exports = { app }
