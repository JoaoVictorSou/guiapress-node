const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db/database')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

const articleController = require('./articles/ArticlesController')
const categoriesController = require('./categories/CategoriesController')
const usersController = require('./user/UsersController')

const server = express()

//VIEW ENGINE
server.set('view engine', 'ejs')

//SERVER ATRIBUTES
server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

//DATABASE
connection
    .authenticate()
    .then(() => {
        console.log(`connection SUCCESS`)
    })
    .catch((error) => {
        console.log(`connection FAILED: ${error}`)
    })

//ROUTES
server.use('/', categoriesController)
server.use('/', articleController)
server.use('/', usersController)

server.get('/', (req, res) => {
    Article
        .findAll({
            raw: true, 
            order: [
                ['id', 'DESC']
            ],
            limit: 4
        })
        .then((articles) => {
            Category
                .findAll( {raw: true} )
                .then((categories) => {
                    res.render('index', {articles: articles, categories: categories})
                })
                .catch((error) => {
                    console.log(`categories list ERROR: ${error} `)
                    res.render('index')
                })
        })
        .catch((error) => {
            console.log(`article list ERROR: ${error} `)
            res.render('index')
        })
})

server.get('/:slug', (req, res) => {
    const slug = req.params.slug
    
    Article
        .findOne({
            where: {
                slug: slug
            }
        })
        .then(article => {
            if (article) {
                Category
                    .findAll( {raw: true} )
                    .then((categories) => {
                        res.render('article', {article: article, categories: categories})
                    })
                    .catch((error) => {
                        console.log(`categories list ERROR: ${error} `)
                        res.redirect('/')
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch((error) => {
            console.log(`ERROR to find required article: ${error}`)
            req.redirect('/')
        })
})

server.get('/category/:slug', (req, res) => {
    const slug = req.params.slug

    Category
        .findOne({
            where: {
                slug: slug
            },
            include: {
                model: Article
            }
        })
        .then((category) => {
            if (category) {
                Category
                    .findAll()
                    .then(categories => {
                        res.render('index', {categories: categories, articles: category.articles})
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch((error) => {
            console.log(`ERROR to find required category: ${error}`)
            req.redirect('/')
        })
})

//SERVER EXECUTION
server.listen(80, () => {
    console.log('servidor iniciado')
})