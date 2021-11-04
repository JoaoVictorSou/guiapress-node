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
    if (title) {
        const slug = slugify(title)
        Category
            .create({
                title: title,
                slug: slug
            })
            .then(() => {
                res.redirect('/admin/categories')
            })
    } else {
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', (req, res) => {
    Category
        .findAll({ raw: true })
        .then((categories) => {
            res.render('admin/categories/index', {categories: categories})
        })
        .catch((error) => {
            console.log(`category list was FAILED: ${error}`)
        })
})

module.exports = router