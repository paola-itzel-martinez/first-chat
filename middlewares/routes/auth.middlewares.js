const { check } = require('express-validator')
const { validateFields } = require('..')

const login = [
    check('email', 'email not allowed').isEmail(),
    check('password', 'password not allowed').isLength(6),
    validateFields
]

const googleSignIn = [
    check('googleToken', 'id_token is missing').not().isEmpty(),
    validateFields
]

module.exports = {
    googleSignIn,
    login
}
