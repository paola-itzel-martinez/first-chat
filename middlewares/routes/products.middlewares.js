const { check } = require('express-validator')
const { isValidProductId } = require('../../helpers')
const {
    isAdmin,
    validateFields,
    validateToken
} = require('..')

const getAll = []

const getById = [
    check('id').custom(isValidProductId),
    validateFields
]

const create = [
    validateToken,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    validateFields
]

const update = [
    validateToken,
    check('id').custom(isValidProductId),
    validateFields
]

const deleteProduct = [
    validateToken,
    isAdmin,
    check('id').custom(isValidProductId),
    validateFields
]

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct
}
