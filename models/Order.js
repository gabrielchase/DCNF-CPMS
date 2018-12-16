const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    partner_name: { type: String, required: true },
    email_address: { type: String },
    mobile_number: { type: String },
    address: { type: String },
    date_of_birth: { type: String },
    account_number: { type: String },
    
    package_id: { type: String },
    status: { type: String, enum: ['In Progress', 'Completed'] },
    description: { type: String },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String },
    deleted_on: { type: String }
})

module.exports = mongoose.model('Order', Order)
