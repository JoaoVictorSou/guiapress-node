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

router.get('/admin/users/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    User
        .findByPk(id)
        .then(user => {
            if (user) {
                Category
                    .findAll()
                    .then(categories => {


                        res.render('admin/users/edit', {
                            user: {
                                email: user.email,
                                id: user.id
                            },
                            categories: categories
                        })
                    })
                    .catch((err) => {
                        console.log(`[ERR] category secondary-list FAIL (user edit): ${err}`)
                        res.redirect('/')
                    })
            } else {
                res.redirect('/admin/user')
            }
        })
        .catch((err) => {
            console.log(`[ERR] user edit FAIL: ${err}`)
            res.redirect('/')
        })
})

router.post('/users/update', adminAuth, (req, res) => {
    const email = req.body.email
    const current = req.session.user
    const id = req.body.id

    User
        .update({
            email: email
        }, 
        {
            where: {
                id: id
            }
        })
        .then(_ => {
            if (current.id == id) {
                res.redirect('/logout')
            } else {
                res.redirect('/admin/users')
            }
        })
        .catch((err) => {
            console.log(`[ERR] user update FAIL: ${err}`)
            res.redirect('/')
        })
})

router.post('/users/delete', adminAuth, (req, res) => {
    const id = req.body.id
    const current = req.session.user

    User
        .destroy({
            where: {
                id: id
            }
        })
        .then(_ => {
            if (current.id == id) {
                res.redirect('/logout')
            } else {
                res.redirect('/admin/users')
            }
        })
        .catch((err) => {
            console.log(`[ERR] user delete FAIL: ${err}`)
            res.redirect('/')
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

router.get('/logout', adminAuth, (req, res) => {
    req.session.user = undefined
    res.redirect('/login')
})

module.exports = router