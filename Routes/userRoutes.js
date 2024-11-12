const express = require('express')

const userController = require('../Controller/SignupLogin')

const router = express.Router()


router.post('/signup', userController.signup);

router.post('/login', userController.login)

router.post('/resetLink/:token', userController.resetPasswordLink)

router.post('/forgetPassword', userController.forgetPassword)


module.exports = router ;





