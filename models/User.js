const mongoose = require('mongoose')

const User = new mongoose.Schema({
    farm_name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String },
    deleted_on: { type: String }
})

module.exports = mongoose.model('User', User)
