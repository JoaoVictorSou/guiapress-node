const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db/database')

const categoriesController = require('./categories/CategoriesController')
const articleController = require('./articles/ArticlesController')
const Article = require('./articles/Article')

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

server.get('/', (req, res) => {
    Article
        .findAll({raw: true, order: [
            ['id', 'DESC']
        ]})
        .then((articles) => {
            res.render('index', {articles: articles})
        })
        .catch((error) => {
            console.log(`ARTICLE LIST ERROR: ${error} `)
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
        .then((article) => {
            if (article) {
                res.render('article', {article: article})
            } else {
                res.redirect('/')
            }
        })
        .catch((error) => {
            console.log(`ERROR to find required article: ${error}`)
            req.redirect('/')
        })
})

//SERVER EXECUTION
server.listen(80, () => {
    console.log('servidor iniciado')
})