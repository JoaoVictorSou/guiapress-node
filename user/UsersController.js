const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
    res.send('hello, world')
})

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new')
})

router.post('/users/save', (req, res) => {
    const email = req.body.email || null
    const password = req.body.password || null
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    User
        .create({
            email: email,
            password: hash
        })
        .then(() => {
            res.redirect('/admin/users')
        })
        .catch((err) => {
            console.log(`[ERR] user IS NOT saved: ${err}`)
            res.redirect('/admin/users/new')
        })
})

module.exports = router