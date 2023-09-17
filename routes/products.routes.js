const { Router } = require('express')
const { productsController } = require('../controllers')
const middlewares = require('../middlewares/routes/products.middlewares')

const router = Router()

router.get('/', middlewares.getAll, productsController.getAll)

router.get('/:id', middlewares.getById, productsController.getById)

router.post('/', middlewares.create, productsController.create)

router.put('/:id', middlewares.update, productsController.update)

router.delete('/:id', middlewares.delete, productsController.delete)

module.exports = router
