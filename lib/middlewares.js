const jwt = require('jsonwebtoken')

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
    }
}
