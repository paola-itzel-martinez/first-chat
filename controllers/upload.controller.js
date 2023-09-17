const { isEmpty } = require("lodash")
const cloudinary = require("cloudinary").v2
const path = require("path")
const {
  deleteFsFile,
  existFsFile,
  searchUserById,
  searchProductById,
  setResponseError,
  uploadFile
} = require('../helpers')

cloudinary.config(process.env.CLOUDINARY_URL)

const NOT_FOUND_PATH = path.join(__dirname, '../assets/no_image.jpg')

const getFile = async(request, response) => {
  const { id, collection } = request.params

  try {
    let model

    switch (collection) {
      case "users":
        const userFinded = await searchUserById({ id })

        if(userFinded.code !== 200) {
          return setResponseError({ response, ...userFinded })
        }

        model = userFinded.data.user
        break
  
      case "products":
        const productFinded = await searchProductById({ id })

        if(productFinded.code !== 200) {
          return setResponseError({ response, ...productFinded })
        }

        model = productFinded.data.product
        break

      default:
        return setResponseError({ response, code: 500 })
    }

    const { img } = model

    if (isEmpty(img)) return response.sendFile(NOT_FOUND_PATH)

    const { exists, fullPath } = existFsFile({
      filePath: path.join(__dirname, '../uploads', collection),
      name: img
    })

    if (exists) return response.sendFile(fullPath)
    
    return response.sendFile(NOT_FOUND_PATH)
  } catch (error) {
    setResponseError({ response, error, code: 500 })
  }
}

const upload = async(request, response) => {
  const { file } = request.files

  try {
    const data = await uploadFile({ file })
  
    response.json(data)
  } catch (error) {
    setResponseError({ response, ...error })
  }
}

const updateFile = async(request, response) => {
  const { file } = request.files
  const { id, collection } = request.params

  try {
    let model

    switch (collection) {
      case "users":
        const userFinded = await searchUserById({ id })

        if(userFinded.code !== 200) {
          return setResponseError({ response, ...userFinded })
        }

        model = userFinded.data.user
        break
  
      case "products":
        const productFinded = await searchProductById({ id })

        if(productFinded.code !== 200) {
          return setResponseError({ response, ...productFinded })
        }

        model = productFinded.data.product
        break

      default:
        return setResponseError({ response, code: 500 })
    }

    const {
      file: newFile
    } = await uploadFile({ file, collection })

    const { img: oldImg } = model

    model.img = newFile

    await model.save()

    if (!isEmpty(oldImg)) {
      deleteFsFile({
        path: path.join(__dirname, '../uploads', collection, oldImg)
      })
    }
  
    response.json(model)
  } catch (error) {
    setResponseError({ response, error })
  }
}

const updateCloudinaryFile = async(request, response) => {
  const { file } = request.files
  const { id, collection } = request.params

  try {
    let model

    switch (collection) {
      case "users":
        const userFinded = await searchUserById({ id })

        if(userFinded.code !== 200) {
          return setResponseError({ response, ...userFinded })
        }

        model = userFinded.data.user
        break
  
      case "products":
        const productFinded = await searchProductById({ id })

        if(productFinded.code !== 200) {
          return setResponseError({ response, ...productFinded })
        }

        model = productFinded.data.product
        break

      default:
        return setResponseError({ response, code: 500 })
    }

    const [_, oldImageId] = model.img ? model.img.match(/\/([^/]+)\.\w+$/) : []
    const { tempFilePath } = file
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    model.img = secure_url

    await model.save()

    if (!isEmpty(oldImageId)) await cloudinary.uploader.destroy(oldImageId)
  
    response.json(model)
  } catch (error) {
    setResponseError({ response, error })
  }
}

module.exports = {
  getFile,
  updateFile,
  updateCloudinaryFile,
  upload
}
