const express = require('express')
const router = express.Router()

router.get('/categories', (req, res) => {
    res.send('hello, categories!')
})

router.get('/admin/categories/new', (req, res) => {
    res.send('hello, categories new')
})

module.exports = router