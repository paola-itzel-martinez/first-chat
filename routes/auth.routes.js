const { Router } = require('express')
const { authController } = require('../controllers')
const middlewares = require('../middlewares/routes/auth.middlewares')

const router = Router()

router.post('/login', middlewares.login, authController.login)
router.post('/googleSignIn', middlewares.googleSignIn, authController.googleSignIn)

module.exports = router
