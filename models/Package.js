const mongoose = require('mongoose')

const Package = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    total_months: { type: Number }, 
    payment: { type: Number },
    payouts: [ mongoose.Schema.Types.Mixed ],

    created_on: { type: String, default: new Date() },
    modified_on: { type: String },
    deleted_on: { type: String }
})

module.exports = mongoose.model('Package', Package)
