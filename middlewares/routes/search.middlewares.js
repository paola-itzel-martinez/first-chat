const { check } = require('express-validator')
const { validateFields, validateToken } = require('..')

const getSearch = [
    validateToken,
    check('collection', 'collection is required').not().isEmpty(),
    check('term', 'term is required').not().isEmpty(),
    validateFields
]

module.exports = {
    getSearch
}
