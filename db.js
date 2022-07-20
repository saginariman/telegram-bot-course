const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'telega_bot',
    'postgres',
    'root',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
)