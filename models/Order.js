const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    partner_name: { type: String, required: true },
    email_address: { type: String },
    mobile_number: { type: String },
    address: { type: String },
    date_of_birth: { type: String },
    account_number: { type: String },
    
    package_id: { type: String },
    user_id: { type: String },
    status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
    description: { type: String },

    created_on: { type: Date, default: Date.now },
    modified_on: { type: Date },
    deleted_on: { type: Date }
})

module.exports = mongoose.model('Order', Order)
