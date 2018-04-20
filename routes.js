const express = require('express')
const { check } = require('express-validator/check')

const UserController = require('./controllers/UserController')
const ChurchController = require('./controllers/ChurchController')

const VerifyToken = require('./controllers/VerifyToken')

const router = express.Router()

const registerValidator = [
  check('email')
    .isEmail()
    .withMessage('must be an email')
    .trim()
    .normalizeEmail(),

  check('password', 'passwords must be at least 5 chars long and contain one number')
    .isLength({ min: 5 })
    .matches(/\d/),

  check('addresses.*.postalCode').isPostalCode()
]

router.get('/', function(req, res) {
  res.json({ message: 'hooray! Welcome to our API!' })
})

/**
 * Church Routes
 */
router.post('/church', ChurchController.create)
router.get('/church', ChurchController.list)
router.put('/church/:church_id', ChurchController.update)
router.get('/church/:church_id', ChurchController.show)
router.delete('/church/:church_id', ChurchController.delete)

/**
 * User Routes
 */
router.post('/register', registerValidator, UserController.register)
router.get('/me', VerifyToken, UserController.me)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

module.exports = router
