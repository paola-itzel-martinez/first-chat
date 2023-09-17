const auth = require('./auth')
const files = require('./files')
const rol = require('./rol')
const validateFields = require('./validateFields')

module.exports = {
    ...auth,
    ...files,
    ...rol,
    ...validateFields
}
