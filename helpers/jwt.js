const jwt = require('jsonwebtoken')

const createJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.LOGIN_TOKEN_KEY,
            {
                expiresIn: '24h'
            },
            (error, token) => {
                if (error) {
                    reject('Without access')
                } else {
                    resolve(token)
                }
            }
        )
    })
}

module.exports = {
    createJWT
}
