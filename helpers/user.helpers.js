const { ObjectId } = require('mongoose').Types
const { encryptPassword } = require('./encryptPassword')
const { User } = require('../models')

const searchUserById = async({ id }) => {
  try {
    const isMongoId = ObjectId.isValid(id)

    if (!isMongoId) return { code: 500 }

    const user = await User.findById(id)

    return {
      code: 200,
      data: {
        user
      }
    }
  } catch (error) {
    return {
      code: 500,
      error
    }
  }
}

const searchUser = async(term) => {
  const status = true

  try {
    const isMongoId = ObjectId.isValid(term)
    const idSearch = isMongoId ? new ObjectId(term) : null
    const regex = new RegExp(term, 'i')
    
    const query = {
      $or: [
        { name: regex },
        { email: regex },
        { _id: idSearch }
      ],
      $and: [{ status }]
    }

    const [total, results] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
    ])

    return {
      code: 200,
      data: {
        total,
        results
      }
    }
  } catch (error) {
    return {
      code: 500,
      error
    }
  }
}

const createUser = async(newUser) => {
  const { password } = newUser
  let user = null

  try {
    user = new User(newUser)

    if (user) {
      user.password = encryptPassword({ password })
    
      await user.save()
    }

    return {
      code: 200,
      data: user
    }
  } catch (error) {
    return {
      code: 500,
      error
    }
  }
}

module.exports = {
  searchUser,
  searchUserById,
  createUser
}
