const { check } = require('express-validator')
const {
    checkFileParam,
    validateFields,
    validateToken
} = require('..')

const getFile = [
    validateToken,
    check('id', 'id not valid').isMongoId(),
    check('collection', (collection) => {
        const isValid = ['users', 'products'].includes(collection)

        if (!isValid) throw new Error(`Invalid request for ${collection}`)

        return true
    }),
    validateFields
]

const updateFile = [
    validateToken,
    check('id', 'id not valid').isMongoId(),
    check('collection', (collection) => {
        const isValid = ['users', 'products'].includes(collection)

        if (!isValid) throw new Error(`Invalid request for ${collection}`)

        return true
    }),
    checkFileParam(),
    validateFields
]

const uploadFile = [
    validateToken,
    checkFileParam(),
    validateFields
]

module.exports = {
    getFile,
    updateFile,
    uploadFile
}
