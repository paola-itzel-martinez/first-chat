
const { saveDB } = require('./saveFile')

const setResponseError = ({
    response,
    code = 400,
    error = 'Failed request'
}) => {
    console.error(error)
    saveDB({ type: "ERROR", data: error })
    return response.status(code).json({ code, error })
}

module.exports = {
    setResponseError
}
