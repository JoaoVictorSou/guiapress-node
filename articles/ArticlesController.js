const express = require('express')
const Article = require('./Article')
const Category = require('../categories/Category')
const slugify = require('slugify')
const router = express.Router()

router.get('/admin/articles', (req, res) => {
    Article
        .findAll({include: [{model: Category}]})
        .then((articles) => {
            res.render('admin/articles/index', {articles: articles})
        })
        .catch((error) => {
            console.log(`articles list was FAILED: ${error}`)
            res.render('index')
        })
})

router.get('/admin/articles/new', (req, res) => {
    Category
        .findAll( {raw: true} )
        .then((categories) => {
            res.render('admin/articles/new', {categories: categories})
        })
        .catch((error) => {
            console.log(`find articles ERROR ${error}`)
            res.render('admin/articles/new')
        })
})

router.post('/articles/save', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.categoryId

    Article
        .create({
            title: title,
            body: body,
            categoryId: categoryId,
            slug: slugify(title)
        })
        .then(() => {
            res.redirect('/admin/articles')
        })
})

router.get('/admin/articles/edit/:id', (req, res) => {
    const id = req.params.id
    Article
        .findByPk(id)
        .then(article => {
            if (article) {
                Category
                    .findAll()
                    .then(categories => {
                        res.render('admin/articles/edit', {
                            article: article,
                            categories: categories
                        })
                    })    
            } else {
                res.redirect('/')
            }
        })
        .catch(error => {
            console.log(`article edition screen FAILED ${error}`)
            res.redirect('/admin/articles')
        })
})

router.post('/articles/update', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.categoryId
    const id = req.body.id

    if (title && body && categoryId) {
        let slug = slugify(title)
        Article
        .update({
            title: title,
            body: body,
            slug: slug,
            categoryId: categoryId
        }, 
        {
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect(`/admin/articles/edit/${id}`)
    }
})

router.post('/articles/delete', (req, res) => {
    const id = req.body.id

    if (id && !isNaN(id)) {
        Article
        .destroy({where: {id: id}})
        .then(() => {
            res.redirect('/admin/articles')
        })
        .catch((error) => {
            console.log(error)
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('/admin/articles')
    }
})

module.exports = router