const jwt = require('jsonwebtoken')

const Order = require('../models/Order')
const Payment = require('../models/Payment')

const { fail } = require('./json_wrappers')

module.exports = {
    checkJWT: async (req, res, next) => {
        try {
            const token  = req.headers.authorization.split(' ')[1]
            let { _id, farm_name, email, exp } = await jwt.decode(token)
            
            const now_str = Date.now().toString()
            const pad_length = now_str.length
            
            let exp_str = exp.toString() 
            exp_str = exp_str.padEnd(pad_length, 0)
            exp = parseInt(exp_str)
            
            if (Date.now() > exp_str) 
                throw new Error('JWT has expired')
            
            req.user = {
                _id,
                farm_name,
                email
            }

            return next()
        } catch (err) {
            console.log('Error checking JWT: ', err)
            fail(res, err)
        }
    },
    checkOrderUser: async (req, res, next) => {
        try {
            const { order_id } = req.params
            const order = await Order.findById(order_id)

            if (order.user_id === req.user._id)
                return next()
            else 
                throw new Error(`User ${req.user._id} is not authorized to action this ORDER`)
        } catch (err) {
            console.log(err)
            fail(res, err)            
        }
    },
    checkPaymentUser: async (req, res, next) => {
        try {
            const { payment_id } = req.params
            const payment = await Payment.findById(payment_id)

            if (payment.user_id === req.user._id)
                return next()
            else 
                throw new Error(`User ${req.user._id} is not authorized to action this PAYMENT`)
        } catch (err) {
            console.log(err)
            fail(res, err)            
        }
    }
}
