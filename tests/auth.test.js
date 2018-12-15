const request = require('supertest')
const jwt = require('jsonwebtoken')
const assert = require('chai').assert

const User = require('../models/User')

const { app } = require('../app')
const { good_farm, bad_farm } = require('./fixtures/users.json')

describe('Auth tests', () => {
    let farm_id

    before(async() => {
        const users = await User.find({})
        console.log(users.length)
        if (users.length > 0)
            await User.remove({})
    })

    it('Should register a user', async () => {
        const { body } = await request(app)
                                            .post('/api/auth/register')
                                            .send(good_farm)
        
        const registered_farm = await User.findById(body.data._id)
        assert.isTrue(body.success)
        assert.exists(body.data._id)
        assert.equal(good_farm.email, body.data.email)
        assert.equal(good_farm.farm_name, body.data.farm_name)

        assert.exists(registered_farm.created_on)
        assert.exists(registered_farm.password)
        assert.notEqual(good_farm.password, registered_farm.password)
    })

    it('Should not save a duplicate user', async () => {
        const { body } = await request(app)
                                .post('/api/auth/register')
                                .send(good_farm)
        
        assert.isFalse(body.success)
        assert.exists(body.reason)
    })
})

