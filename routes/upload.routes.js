const { Router } = require('express')
const { uploadController } = require('../controllers')
const middlewares = require('../middlewares/routes/upload.middlewares')

const router = Router()

router.post('/', middlewares.uploadFile, uploadController.upload)
router.get('/:collection/:id', middlewares.getFile, uploadController.getFile)
router.put('/:collection/:id', middlewares.updateFile, uploadController.updateFile)
router.put('/cloudinary/:collection/:id', middlewares.updateFile, uploadController.updateCloudinaryFile)

module.exports = router
