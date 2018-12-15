const config = require('./env.json')
const env = process.env.NODE_ENV || 'development'
const env_config = config[env]

module.exports = env_config