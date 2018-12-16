const Order = require('../models/Order')

const { checkJWT } = require('../lib/middlewares')
const { success, fail } = require('../lib/json_wrappers')

module.exports = function(app) {
    app.post('/api/package/:package_id/orders', checkJWT, async (req, res) => {
        const { package_id } = req.params
        try {
            req.body.package_id = package_id
            req.body.user_id = req.user._id

            const order = new Order(req.body)
            await order.save()

            success(res, order)
        } catch (err) {
            fail(res, err)
        }
    })
}
