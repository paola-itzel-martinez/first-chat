const { Router } = require('express')
const { searchController } = require('../controllers')
const middlewares = require('../middlewares/routes/search.middlewares')

const router = Router()

router.get('/:collection/:term', middlewares.getSearch, searchController.getSearch)

module.exports = router
