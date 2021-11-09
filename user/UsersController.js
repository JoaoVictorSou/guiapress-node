const express = require('express')
const router = express.Router()
const User = require('./User')

router.get('/admin/users', (req, res) => {
    res.send('hello, world')
})

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new')
})

router.post('/users/save', (req, res) => {
    const email = req.body.email || null
    const password = req.body.password || null

    res.json({email, password})
})

module.exports = router