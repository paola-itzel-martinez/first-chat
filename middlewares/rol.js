const { setResponseError } = require('../helpers')

const PERMISSIONS_ERROR = {
    code: 401,
    error: 'Without perssions'
}
    

const isAdmin = (request, response, next) => {
    const { rol } = request.user  || {}
    const isAdmin = rol === 'ADMIN_ROL' ?? false

    if (!isAdmin) return setResponseError({ response, ...PERMISSIONS_ERROR })

    next()
}

const hasRole = (...rols) => {
    return (request, response, next) => {
        const { rol } = request.user  || {}
        const hasRol = [...rols].includes(rol) ?? false

        if (!hasRol) return setResponseError({ response, ...PERMISSIONS_ERROR })

        next()
    }
}

module.exports = {
    isAdmin,
    hasRole
}
