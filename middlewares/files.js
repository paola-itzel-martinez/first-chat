const { has } = require('lodash');
const { setResponseError } = require("../helpers")

const checkFileParam = ({ name } = { name: "file" }) => {
    return (request, response, next) => {
        try {
            const existFile = has(request, `files.${name}`)

            if (!existFile) {
                return setResponseError({
                    response,
                    error:'No files were uploaded'
                })
            }

            next()
        } catch (error) {
            return setResponseError({
                response,
                code: 500
            })
        }
    }
}

module.exports = {
    checkFileParam
}
