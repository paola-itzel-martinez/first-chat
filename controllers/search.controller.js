const {
    searchCategories,
    searchProducts,
    searchUser,
    setResponseError
} = require('../helpers')

const ENUM_ALLOWED_COLLECTION = {
    categories: 'categories',
    products: 'products',
    users: 'users'
}

const ALLOWED_COLLECTIONS = [
    ENUM_ALLOWED_COLLECTION.categories,
    ENUM_ALLOWED_COLLECTION.products,
    ENUM_ALLOWED_COLLECTION.users
]
  
const getSearch = async(request, response) => {
  const { collection, term } = request.params

  try {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
        setResponseError({
            response,
            code: 401,
            error: `collection ${collection} not allowed`
        })
    }

    switch (collection) {
        case ENUM_ALLOWED_COLLECTION.categories:
            const { data: categories } = await searchCategories(term)

            return response.json(categories)
        case ENUM_ALLOWED_COLLECTION.products:
            const { code, data: products, error } = await searchProducts(term)

            if (code === 200) return response.json(products)

            return setResponseError({ response, error })
        case ENUM_ALLOWED_COLLECTION.users:
            const { data: users } = await searchUser(term)

            return response.json(users)
        default:
            return setResponseError({
                response,
                code: 400,
                error: `Not found`
            })
    }
  } catch (error) {
    return setResponseError({ response, error })
  }
}
  
module.exports = {
    getSearch
}
  