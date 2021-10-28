const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db/database')

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
server.get('/', (req, res) => {
    res.render('index')
})

//SERVER EXECUTION
server.listen(80, () => {
    console.log('servidor iniciado')
})