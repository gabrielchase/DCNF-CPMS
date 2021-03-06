const mongoose = require('mongoose')

const Payment = new mongoose.Schema({
    partner_name: { type: String, required: true },
    package_id: { type: String, required: true },
    due_date: { type: Date },
    amount: { type: Number },
    paid: { type: Boolean, default: false },
    paid_by: { type: String },
    order_id: { type: String },
    user_id: { type: String },

    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date },
    deleted_on: { type: Date }
})

module.exports = mongoose.model('Payment', Payment)
