const Sequelize = require('sequelize')
const connection = require('../db/database')

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User
    .sync({
        force: false
    })
    .then(() => {
        console.log('user table was CREATED')
    })
    .catch((err) => {
        console.log('CATEGORY table was NOT CREATED')
    })

module.exports = User