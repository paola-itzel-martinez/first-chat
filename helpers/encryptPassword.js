const bcryptjs = require('bcryptjs')

const encryptPassword = ({ password }) => {
    try {
        const salt = bcryptjs.genSaltSync()
    
        return bcryptjs.hashSync(password, salt)  
    } catch {
        return null
    }
}

const isValidPassword = (toReview, password) => {
    return bcryptjs.compareSync(toReview, password)
}

module.exports = {
    encryptPassword,
    isValidPassword
}