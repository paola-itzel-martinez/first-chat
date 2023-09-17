const { check } = require('express-validator')
const { isValidCategoryId } = require('../../helpers')
const {
    isAdmin,
    validateFields,
    validateToken
} = require('..')

const getAll = []

const getById = [
    check('id').custom(isValidCategoryId),
    validateFields
]

const create = [
    validateToken,
    check('name', 'name is required').not().isEmpty(),
    validateFields
]

const update = [
    validateToken,
    check('name', 'name is required').not().isEmpty(),
    check('id').custom(isValidCategoryId),
    validateFields
]

const deleteCategory = [
    validateToken,
    isAdmin,
    check('id').custom(isValidCategoryId),
    validateFields
]

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteCategory
}
