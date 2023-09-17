
const {
  createJWT,
  isValidPassword,
  setResponseError
} = require('../helpers')
const { Category } = require('../models')

const CATEGORY_NOT_FOUND_ERROR = {
  code: 400,
  error: "category not found"
}

const CATEGORY_NOT_UPDATED_ERROR = {
  code: 500,
  error: "category not updated"
}

const getAll = async(request, response) => {
  const {
    limit = 10,
    skip = 0,
    status = true
  } = request.query

  try {
    const [total, categories] = await Promise.all([
      Category.countDocuments({ status }),
      Category.find({ status })
        .populate('user', 'name')
        .limit(Number(limit))
        .skip(Number(skip))
    ])
  
    response.json({ total, categories })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const getById = async(request, response) => {
  const { id } = request.params

  try {
    const category = await Category.findById(id).populate('user', 'name')

    if (category ) return response.json({ category })

    setResponseError({
      response,
      error: CATEGORY_NOT_FOUND_ERROR
    })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const create = async(request, response) => {
  try {
    const name = request.body.name.toUpperCase()
    const exists = await Category.findOne({ name })
  
    if (exists) return setResponseError({ response, error: 'Category already exists' })

    const category = new Category({
      name,
      user: request.user._id
    })

    await category.save(category)

    response.json({ category })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const update = async(request, response) => {
  const { id } = request.params
  const name = request.body.name.toUpperCase()
  const user = request.user._id
  const newData = { name, user }

  try {
    const category = await Category
      .findByIdAndUpdate(id, newData, { new: true })
      .populate('user', 'name')

    if (category) return response.json({ category })

    setResponseError({
      response,
      error: CATEGORY_NOT_UPDATED_ERROR
    })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

const deleteCategory = async(request, response) => {
  try {
    const { id } = request.params
    const user = request.user._id
    const newData = {
      status: false,
      user
    }

    const category = await Category
      .findByIdAndUpdate(id, newData)
      .populate("user", "name")
  
    response.json({ category })
  } catch (error) {
    return setResponseError({ response, error })
  }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteCategory,
}
