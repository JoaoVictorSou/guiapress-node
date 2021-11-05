const express = require('express')
const Category = require('./Category')
const router = express.Router()
const slugify = require('slugify')

router.get('/admin/categories', (req, res) => {
    Category
        .findAll({ raw: true })
        .then((categories) => {
            res.render('admin/categories/index', {categories: categories})
        })
        .catch((error) => {
            console.log(`category list was FAILED: ${error}`)
            res.render('index')
        })
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

router.get('/admin/categories/edit/:id', (req, res) => {
    const id = req.params.id

    if (isNaN(id)) {
        res.redirect('/admin/categories')
    } 

    Category
        .findByPk(id)
        .then((category) => {
            if (category) {
                res.render('admin/categories/edit', {category: category})
            } else {
                res.redirect('/admin/categories')
            }
        })
        .catch((error) => {
            console.log(`category NOT FOUND ${error}`)
            res.redirect('/admin/categories')
        })
})

router.post('/categories/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title

    if (title) {
        const slug = slugify(title)
        Category
            .update(
                {
                    title: title,
                    slug: slug
                }, 
                {where: {id: id}
            })
            .then(() => {
                res.redirect('/admin/categories')
            })
            .catch( (error) => {
                console.log(`update table FAILED: ${error}`)
                res.redirect(`/admin/categories/edit/${id}`)
            })
    } else {
        res.redirect(`/admin/categories/edit/${id}`)
    }
})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id

    if(id && !isNaN(id)) {
        Category
            .destroy({
                where: {
                    id: id
                }
            })
            .then(() => {
                res.redirect('/admin/categories')
            })
    } else {
        res.redirect('/admin/categories')
    }
})

module.exports = router