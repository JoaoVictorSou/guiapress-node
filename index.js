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
        .findAll({
            raw: true, 
            order: [
                ['id', 'DESC']
            ],
            limit: 4
        })
        .then((articles) => {
            Category
                .findAll()
                .then((categories) => {
                    Article
                        .count()
                        .then(articlesQuantity => {
                            let pageExistence = articlesQuantity > 4
                            res.render('index', {
                                articles, 
                                categories, 
                                pageExistence
                            })
                        })
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
        .catch((error) => {
            console.log(`ERROR to find required category: ${error}`)
            req.redirect('/')
        })
})

//SERVER EXECUTION
server.listen(80, () => {
    console.log('servidor iniciado')
})