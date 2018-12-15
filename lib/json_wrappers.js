module.exports = {
    success: (res, data) => {
        const obj = {
            success: true,
            data: data
        }
        res.json(obj)
    },
    fail: (res, err) => {
        const obj = {
            success: false,
            reason: err.message
        }
        res.json(obj)
    }
}
