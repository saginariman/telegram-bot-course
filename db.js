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
// module.exports = new Sequelize(
//     'f0497377_nari',
//     'f0497377',
//     'ivkivieric',
//     {
//         host: 'localhost',
//         port: '3306',
//         dialect: 'mysql'
//     }
// )