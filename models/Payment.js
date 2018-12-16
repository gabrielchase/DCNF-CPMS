const mongoose = require('mongoose')

const Payment = new mongoose.Schema({
    partner_name: { type: String, required: true },
    package_id: { type: String, required: true },
    month: { type: Number },
    paid: { type: Boolean, default: false },
    amount: { type: Number },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String },
    deleted_on: { type: String }
})

module.exports = mongoose.model('Payment', Payment)
