
const { setResponseError } = require('../helpers')
const { Product } = require('../models')
  
const PRODUCT_NOT_FOUND_ERROR = {
  code: 400,
  error: "product not found"
}
  
const PRODUCT_NOT_UPDATED_ERROR = {
  code: 500,
  error: "product not updated"
}

const populateProduct = (query) => {
  return query
    .populate("user", ["name", "email"])
    .populate("category", "name")
};

const getAll = async(request, response) => {
  const {
    limit = 10,
    skip = 0,
    status = true,
    hasAvailability = true
  } = request.query

  try {
    const [total, products] = await Promise.all([
      Product.countDocuments({ status }),
      populateProduct(
        Product.find({ status })
        .limit(Number(limit))
        .skip(Number(skip))
      )
    ])
  
    response.json({ total, products })
  } catch (error) {
    return setResponseError({ response, error })
  }
}
  
const getById = async(request, response) => {
  const { id } = request.params

  try {
    const product = await populateProduct(Product.findById(id))

    if (product) return response.json({ product })

    setResponseError({
      response,
      error: PRODUCT_NOT_FOUND_ERROR
    })
  } catch (error) {
    return setResponseError({ response, error })
  }
}
  
const create = async(request, response) => {
  try {
    const { name, price, ...newProduct } = request.body
    const nameFormatted = name.toUpperCase()
    const priceFormatted = Number(price)
    const exists = await Product.findOne({ name: nameFormatted })
  
    if (exists) return setResponseError({ response, error: 'Product already exists' })

    const product = new Product({
      ...newProduct,
      name: nameFormatted,
      price: priceFormatted,
      user: request.user._id
    })

    await product.save(product)

    response.json({ product })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const update = async(request, response) => {
  const { id } = request.params
  const { name, price, availability, description } = request.body
  const availabilityFormatted = availability ? Number(availability) : undefined
  const nameFormatted = name ? name.toUpperCase() : undefined
  const priceFormatted = price ? Number(price) : undefined
  const user = request.user._id
  const newData = {
    availability: availabilityFormatted,
    name: nameFormatted,
    price: priceFormatted,
    description,
    user
  }

  try {
    const product = await populateProduct(
      Product.findByIdAndUpdate(id, newData, { new: true })
    )

    if (product) return response.json({ product })

    setResponseError({
      response,
      error: PRODUCT_NOT_UPDATED_ERROR
    })
  } catch (error) {
    return setResponseError({ response, error })
  }
}
  
const deleteProduct = async(request, response) => {
  try {
    const { id } = request.params
    const user = request.user._id
    const newData = {
      status: false,
      user
    }

    const product = await populateProduct(Product.findByIdAndUpdate(id, newData))
  
    response.json({ product })
  } catch (error) {
    return setResponseError({ response, error })
  }
}
  
module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteProduct
}
  