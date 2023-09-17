const { Router } = require('express')
const { categoriesController } = require('../controllers')
const middlewares = require('../middlewares/routes/categories.middlewares')

const router = Router()

router.get('/', middlewares.getAll, categoriesController.getAll)

router.get('/:id', middlewares.getById, categoriesController.getById)

router.post('/', middlewares.create, categoriesController.create)

router.put('/:id', middlewares.update, categoriesController.update)

router.delete('/:id', middlewares.delete, categoriesController.delete)

module.exports = router
