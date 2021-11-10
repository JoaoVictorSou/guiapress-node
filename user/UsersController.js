const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./User')
const Category = require('../categories/Category')

router.get('/admin/users', (req, res) => {
    User
        .findAll()
        .then(users => {
            Category
                .findAll()
                .then(categories => {
                    res.render('admin/users/index', {
                        users: users,
                        categories
                    })
                })
                .catch(err => {
                    console.log(`[ERR] categories secondary-list: ${err}`)
                    res.redirect('/')
                })
        })
        .catch(err => {
            console.log(`[ERR] user list: ${err}`)
            res.redirect('/')
        })
})

router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new')
})

router.post('/users/save', (req, res) => {
    const email = req.body.email || null
    const password = req.body.password || null
    
    User
        .findOne({
            where: {
                email: email
            }
        })
        .then((user) => {
            if (!user) {
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
                        res.redirect('/')
                    })
            } else {
                res.redirect('/admin/users/new')
            }
        })
})

module.exports = router