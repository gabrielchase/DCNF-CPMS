const mongoose = require('mongoose')

const Package = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    total_months: { type: Number }, 
    payment: { type: Number },
    payouts: [ mongoose.Schema.Types.Mixed ],

    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date },
    deleted_on: { type: Date }
})

module.exports = mongoose.model('Package', Package)
