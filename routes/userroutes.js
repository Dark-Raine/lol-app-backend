const express = require('express')
const router = express.Router()
const { digestPassword, validatePassword } = require('../apis/lol/functions')





module.exports = router