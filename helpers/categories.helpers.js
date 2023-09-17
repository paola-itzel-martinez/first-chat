const { ObjectId } = require('mongoose').Types
const { Category } = require('../models')

const searchCategories = async(term) => {
  const status = true

  try {
    const isMongoId = ObjectId.isValid(term)
    const idSearch = isMongoId ? new ObjectId(term) : null
    const regex = new RegExp(term, 'i')
    
    const query = {
      $or: [
        { name: regex },
        { _id: idSearch },
        { user: idSearch },
      ],
      $and: [{ status }]
    }

    const [total, results] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
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

module.exports = {
    searchCategories
}
