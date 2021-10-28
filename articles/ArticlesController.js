const express = require('express')
const router = express.Router()

router.get('/articles', (req, res) => {
    res.send('hello, articles')
})

router.get('/admin/articles/new', (req, res) => {
    res.send('hello, articles new')
})

module.exports = router