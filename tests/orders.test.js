const request = require('supertest')
const jwt = require('jsonwebtoken')
const assert = require('chai').assert

const User = require('../models/User')
const Order = require('../models/Order')
const Payment = require('../models/Payment')
const Package = require('../models/Package')

const { seedPackages } = require('../lib/db_seeds')
const { good_order } = require('./fixtures/orders.json')
const { app } = require('../app')

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzE2NzFmNjA2MjNjYzA0OTM3ZTVmOTciLCJmYXJtX25hbWUiOiJEb24gQ2hpY2hvJ3MiLCJlbWFpbCI6ImRjbmZAZ21haWwuY29tIiwiaWF0IjoxNTQ1NzcxODQxLCJleHAiOjE1NDU4NTgyNDF9.ZL7G0EdUOkyIHVkwk94x4ZRTYz_FQcqR4oHDJYec7Dg'
const user = jwt.decode(JWT)

describe('Order tests', () => {
    let package_id 

    before(async() => {
        const users = await User.find({})
        const orders = await Order.find({})
        const payments = await Payment.find({})
        
        if (users.length > 0)
            await User.remove({})
        if (orders.length > 0)
            await Order.remove({})
        if (payments.length > 0)
            await Payment.remove({})

        seedPackages()

        const packages = await Package.find({})
        package_id = packages[0]._id
        assert.equal(packages.length, 1)
    })

    it('Should register an order and 5 payments', async () => {
        console.log('package_id: ', package_id)
        const { body } = await request(app)
                                .post(`/api/package/${package_id}/orders`)
                                .set('Authorization', `Bearer ${JWT}`)
                                .send(good_order)

        assert.isTrue(body.success)
        assert.exists(body.data._id)
        assert.exists(body.data.created_on)

        assert.equal(body.data.status, 'In Progress')
        assert.equal(body.data.package_id, package_id)
        assert.equal(body.data.user_id, user._id)
        assert.equal(body.data.partner_name, good_order.partner_name)
        assert.equal(body.data.email_address, good_order.email_address)
        assert.equal(body.data.mobile_number, good_order.mobile_number)
        assert.equal(body.data.address, good_order.address)
        assert.equal(body.data.date_of_birth, good_order.date_of_birth)
        assert.equal(body.data.account_number, good_order.account_number)

        const order = await Order.findById(body.data._id)
        const _package = await Package.findById(package_id)
        const payments = await Payment.find({ package_id })

        assert.equal(payments.length, _package.payouts.length)

        for (let i=0; i < _package.payouts.length; i++) {
            assert.exists(payments[i]._id)
            assert.exists(payments[i].created_on)
            assert.equal(payments[i].package_id, package_id)
            assert.equal(payments[i].partner_name, good_order.partner_name)
            assert.equal(payments[i].amount, _package.payouts[i].amount)
            
            const order_created_date = new Date(order.created_on.getFullYear(), order.created_on.getMonth(), order.created_on.getDate())
            const due_date = new Date(order_created_date.setMonth(order.created_on.getMonth() + _package.payouts[i].month))
            
            assert.equal(payments[i].due_date.getFullYear(), due_date.getFullYear())
            assert.equal(payments[i].due_date.getMonth(), due_date.getMonth())
            assert.equal(payments[i].due_date.getDate(), due_date.getDate())
        }
    })
})
