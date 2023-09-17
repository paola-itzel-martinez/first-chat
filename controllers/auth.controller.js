const { request, response } = require('express')
const User = require('../models/user')
const {
  createJWT,
  createUser,
  isValidPassword,
  googleLoginVerify,
  setResponseError
} = require('../helpers')

const AUTH_ERROR = {
  code: 400,
  error: "Bad credentials"
}

const login = async(request, response) => {
  const { email, password } = request.body

  try {
    const user = await User.findOne({ email, status: true })

    if (!user) return setResponseError({ response, ...AUTH_ERROR })

    if (!isValidPassword(password, user.password)) {
      return setResponseError({ response, ...AUTH_ERROR })
    }

    const token = await createJWT({ uid: user.id })

    response.json({ token })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const googleSignIn = async(req, response) => {
  const { googleToken } = req.body

  try {
   const { name, picture, email } = await googleLoginVerify(googleToken)
   const user = await User.findOne({ email, status: true })

   if (!user) {
      const { code } = await createUser({ name, email, password: 'goo' })

      if (code === 500) return setResponseError({ response })
   }

   const token = await createJWT({ uid: user.id })

   response.json({ token, user })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

module.exports = {
    login,
    googleSignIn
}