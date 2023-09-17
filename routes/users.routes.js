const { Router } = require('express')
const { usersController } = require('../controllers')
const middlewares = require('../middlewares/routes/user.middlewares')

const router = Router()

router.get('/', middlewares.get, usersController.getUsers)

router.post('/', middlewares.post, usersController.postUsers)

router.put('/:id', middlewares.put, usersController.putUsers)

router.patch('/', middlewares.patch, usersController.patchUsers)

router.delete('/:id', middlewares.delete, usersController.deleteUsers)

module.exports = router
