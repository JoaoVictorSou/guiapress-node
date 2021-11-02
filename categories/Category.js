const Sequelize = require('sequelize')
const connection = require('../db/database')

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category
    .sync({ force: false })
    .then(() => {
        console.log('CATEGORY table was CREATED')
    })
    .then((error) => {
        console.log(`CATEGORY table was NOT CREATED: ${error}`)
    })

module.exports = Category