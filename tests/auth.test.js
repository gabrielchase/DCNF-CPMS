const request = require('supertest')
const jwt = require('jsonwebtoken')
const assert = require('chai').assert

const User = require('../models/User')

const { app } = require('../app')
const { JWT_SECRET } = require('../config/config')
const { good_farm, good_farm_farm_name_login, good_farm_email_login, bad_login, bad_farm } = require('./fixtures/users.json')

describe('Auth tests', () => {
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

    it('Should provide a JWT when login is succesful via farm_name', async () => {
        const { body } = await request(app)
                                .post('/api/auth/login')
                                .send(good_farm_farm_name_login)
        
        const farm = await User.findOne({ farm_name: good_farm.farm_name })

        assert.isTrue(body.success)
        assert.exists(body.data.token)
        assert.equal(farm._id, body.data._id)
        
        const verified = jwt.verify(body.data.token, JWT_SECRET)
        
        assert.equal(verified._id, body.data._id)
        assert.equal(farm.farm_name, body.data.farm_name)
        assert.equal(farm.email, body.data.email)
    })

    it('Should provide a JWT when login is succesful via email', async () => {
        const { body } = await request(app)
                                .post('/api/auth/login')
                                .send(good_farm_email_login)
        
        const farm = await User.findOne({ email: good_farm.email })

        assert.isTrue(body.success)
        assert.exists(body.data.token)
        assert.equal(farm._id, body.data._id)
        
        const verified = jwt.verify(body.data.token, JWT_SECRET)
        
        assert.equal(verified._id, body.data._id)
        assert.equal(farm.farm_name, body.data.farm_name)
        assert.equal(farm.email, body.data.email)
    })
})

