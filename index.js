const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db/database')
const session = require('express-session')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./user/User')

const articlesController = require('./articles/ArticlesController')
const categoriesController = require('./categories/CategoriesController')
const usersController = require('./user/UsersController')

const server = express()
const time = 60000

//VIEW ENGINE
server.set('view engine', 'ejs')

//SERVER ATRIBUTES
server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(session({
    secret: 'b612',
    cookie: {
        maxAge: time*60
    }
}))

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
server.use('/', articlesController)
server.use('/', usersController)

server.get('/', (req, res) => {
    Article
        .findAndCountAll({ 
            order: [
                ['id', 'DESC']
            ],
            limit: 4
        })
        .then((articles) => {
            Category
                .findAll()
                .then((categories) => {
                    let pageExistence = articles.count > 4
                    res.render('index', {
                        articles: articles.rows, 
                        categories, 
                        pageExistence
                    })
                })
                .catch((err) => {
                    console.log(`[ERR] categories secondary-list NOT found: ${err} `)
                    res.render('index', {
                        categories: [],
                        articles: [],
                        pageExistence: false
                    })
                })
        })
        .catch((err) => {
            console.log(`[ERR] article list FAIL: ${err} `)
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
                        res.render('article', {
                            article, 
                            categories
                        })
                    })
                    .catch((err) => {
                        console.log(`[ERR] categories secondary-list NOT found: ${err} `)
                        res.redirect('/')
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch((err) => {
            console.log(`[ERR] specific article NOT found: ${err}`)
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
                        res.render('index', {
                            categories, 
                            articles: category.articles,
                            pageExistence: false
                        })
                    })
            } else {
                res.redirect('/')
            }
        })
        .catch((err) => {
            console.log(`[ERR] articles in this category NOT found: ${err}`)
            req.redirect('/')
        })
})

//SERVER EXECUTION
server.listen(80, () => {
    console.log('servidor iniciado')
})