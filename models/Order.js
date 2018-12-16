const mongoose = require('mongoose')
const Package = require('./Package')
const Payment = require('./Payment')

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

Order.post('save', async function(doc) {
    try {
        const _package = await Package.findById(doc.package_id)
    
        if (!_package)
            throw new Error(`Package with ID ${doc.package_id} does not exist`)
        
        for (let p of _package.payouts) {
            const order_created_date = doc.created_on
            let current_date = new Date()
            const due_date = current_date.setMonth(order_created_date.getMonth() + p.month)
            
            const payment = new Payment({
                partner_name: doc.partner_name,
                package_id: doc.package_id,
                due_date, 
                amount: p.amount
            })

            await payment.save()
        }    
    } catch (error) {
        throw new Error(`Error creating payments for Order ${doc._id}`)
    }
})

module.exports = mongoose.model('Order', Order)
