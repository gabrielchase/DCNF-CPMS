const moment = require('moment')

const Order = require('../models/Order')
const Package = require('../models/Package')
const Payment = require('../models/Payment')

const { checkJWT, checkOrderUser, checkPaymentUser } = require('../lib/middlewares')
const { success, fail } = require('../lib/json_wrappers')

module.exports = function(app) {
    app.post('/api/package/:package_id/orders', checkJWT, async (req, res) => {
        const { package_id } = req.params
        try {
            // TODO: Check if package exists
            const _package = await Package.findById(package_id)
            
            if (!_package) 
                throw new Error(`Package ${package_id} does not exist`)

            req.body.package_id = package_id
            req.body.user_id = req.user._id

            const order = new Order(req.body)
            await order.save()

            success(res, order)
        } catch (err) {
            fail(res, err)
        }
    })

    // Write test
    app.get('/api/orders', checkJWT, async (req, res) => {
        try {
            const orders = await Order.find({ user_id: req.user._id })

            success(res, orders)
        } catch (err) {
            fail(res, err)
        }
    })

    // Write test
    app.get('/api/orders/:order_id', checkJWT, checkOrderUser, async (req, res) => {
        const { order_id } = req.params
        try {
            const order = await Order.findById(order_id)
            const payments = await Payment.find({ order_id })
            success(res, { order, payments })
        } catch (err) {
            fail(res, err)
        }
    })

    // Write test
    app.get('/api/payments', checkJWT, async (req, res) => {
        let { year, month, date } = req.query 
        console.log('1', year, month, date)
        
        year = parseInt(year)
        month = parseInt(month)
        date = parseInt(date)

        console.log('2', year, month, date) 
        console.log('2', typeof(year), typeof(month), typeof(date))

        try {
            if (month < 1 || month > 12) 
                throw new Error('Month must be between 1 and 12')

            if (date < 1 || date > 31) 
                throw new Error('Date must be between 1 and 31')

            let payments = await Payment.find({ user_id: req.user._id })
            
            if (year && !month && !date) {
                payments =  await Payment.find({ 
                                due_date: { 
                                    $gte: new Date(year, 0, 1), 
                                    $lte: new Date(year, 11, 31) 
                                },
                                user_id: req.user._id
                            })
            } 

            if (year && month && !date) {
                month = month - 1
                payments =  await Payment.find({ 
                    due_date: { 
                        $gte: new Date(year, month, 1, 0, 0, 0), 
                        $lte: new Date(year, month, 31, 0, 0, 0) 
                    },
                    user_id: req.user._id
                })
            }

            if (year && month && date) {
                month = month - 1
                let earlier = new Date(year, month, date + 1)
                let later = new Date(year, month, date + 2)  
                
                earlier = moment(earlier).subtract(16, 'hours')
                later = moment(later).subtract(16, 'hours')
                
                payments =  await Payment.find({ 
                    due_date: { 
                        $gte: earlier, 
                        $lt: later
                    },
                    user_id: req.user._id
                })
            }

            let payments_total = 0
            for (let p of payments) {
                payments_total += p.amount
            }

            success(res, { payments, total: payments_total })
        } catch (err) {
            fail(res, err)
        }
    })

    // Write test
    app.put('/api/payments/:payment_id/paid', checkJWT, checkPaymentUser, async (req, res) => {
        const { payment_id } = req.params
        const { paid } = req.body
        
        try {
            const payment = await Payment.findById(payment_id)
            payment.paid = paid 
            await payment.save()

            const payments_in_order = await Payment.find({ order_id: payment.order_id })
            let all_payments_paid = true 

            for (let p of payments_in_order) {
                console.log(`checking payment ${p._id}: ${p.paid}`)
                if (!p.paid) 
                    all_payments_paid = false
            }

            console.log('all payments paid? ', all_payments_paid)

            if (all_payments_paid) {
                const order = await Order.findById(payment.order_id)
                order.status = 'Completed'
                await order.save()
            }

            success(res, payment)
        } catch (err) {
            fail(res, err)
        }
    })
}
