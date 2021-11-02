const express = require('express')
const Category = require('./Category')
const router = express.Router()
const slugify = require('slugify')

router.get('/categories', (req, res) => {
    res.send('hello, categories!')
})

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    const title = req.body.title
    const slug = slugify(title)
    if (title) {
        Category
            .create({
                title: title,
                slug: slug
            })
            .then(() => {
                res.redirect('/')
            })
    } else {
        res.redirect('/admin/categories/new')
    }
})

module.exports = router