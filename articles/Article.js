const Sequelize = require('sequelize')
const connection = require('../db/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) //UMA Categoria possui VÁRIOS Artigos
Article.belongsTo(Category) //UM Artigo PERTENCE a UMA Categoria

Article
    .sync({ force: false })
    .then(() => {
        console.log('article table was CREATED')
    })
    .catch((error) => {
        console.log(`article table was NOT CREATED: ${error}`)
    })

module.exports = Article