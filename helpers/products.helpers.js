const { ObjectId } = require('mongoose').Types
const { Product } = require('../models')

const searchProductById =  async({ id }) => {
  try {
    const isMongoId = ObjectId.isValid(id)

    if (!isMongoId) return { code: 500 }

    const product = await Product.findById(id)

    return {
      code: 200,
      data: {
        product
      }
    }
  } catch (error) {
    return {
      code: 500,
      error
    }
  }
}

const searchProducts = async(term) => {
  const status = true

  try {
    const isMongoId = ObjectId.isValid(term)
    const idSearch = isMongoId ? new ObjectId(term) : null
    const regex = new RegExp(term, 'i')
    
    const query = {
      $and: [{ status }],
      $or: [
        { name: regex },
        { description: regex },
        { _id: idSearch },
        {
          $expr: {
            $regexMatch: {
              input: {
                $toString: '$price',
              },
              regex
            },
          },
        },
        { category: idSearch },
        { user: idSearch }
      ],
    }

    const [total, results] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
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
  searchProductById,
  searchProducts
}
