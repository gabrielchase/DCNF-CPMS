const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { success, fail } = require('../lib/json_wrappers')
const { JWT_SECRET, JWT_EXPIRATION, SALT_ROUNDS } = require('../config/config')

module.exports = function(app) {
    app.post('/api/auth/login', async (req, res) => {
        console.log('Attempting login: ', req.body)
        const { farm_name, email, password } = req.body 
        let user 

        try {
            if (farm_name && !email) 
                user = await User.findOne({ farm_name })
            if (email && !farm_name) 
                user = await User.findOne({ email })            

            if (!user) 
                throw new Error('User does not exist')
                
            if (user.deleted_on) 
                throw new Error('User deleted')

            const match = await bcrypt.compare(password, user.password)

            if (match) {
                const signed_jwt = jwt.sign(
                    { _id: user._id, farm_name: user.farm_name, email: user.email }, 
                    JWT_SECRET, 
                    { expiresIn: JWT_EXPIRATION }
                )
                const { iat, exp } = jwt.verify(signed_jwt, JWT_SECRET)
                const auth_json = {
                    _id: user._id,
                    farm_name: user.farm_name,
                    email: user.email,
                    token: signed_jwt,
                    iat, 
                    exp
                }

                success(res, auth_json)
            } else {
                throw new Error('Not registered')
            }
        } catch (err) {
            fail(res, err)
        }
    })

    app.post('/api/auth/register', async (req, res) => {
        console.log('Attempting register: ', req.body)
        const { farm_name, email, password } = req.body

        try {
            const hashed_password = await bcrypt.hash(password, SALT_ROUNDS)
            const new_user = await new User({
                farm_name, 
                email,
                password: hashed_password,
            })
            await new_user.save()
            console.log('New user created: ', new_user)
            
            const new_user_json = {
                _id: new_user._id,
                farm_name,
                email,
                created_on: new_user.created_on
            }

            success(res, new_user_json)
        } catch (err) {
            fail(res, err)
        }
    })
}
