const Sequelize = require('sequelize')
const connection = new Sequelize('guiapress', 'root', '552210', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection