const mongoose = require('mongoose')

const User = new mongoose.Schema({
    farm_name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date },
    deleted_on: { type: Date }
})

module.exports = mongoose.model('User', User)
