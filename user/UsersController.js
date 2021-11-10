const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./User')
const Category = require('../categories/Category')

const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', adminAuth, (req, res) => {
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

router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('admin/users/new')
})

router.post('/users/save', adminAuth, (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User
        .findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (user) {
                const correct = bcrypt.compareSync(password, user.password)

                if (correct) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }

                    res.redirect('/admin/articles')
                } else {
                    res.redirect('/login')
                }
            } else {
                res.redirect('/login')
            }
        })
        .catch(err => {
            console.log(`[ERR] user authenticate: ${err}`)
            res.redirect('/')
        })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router