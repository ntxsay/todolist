require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_CONNEXION);

sequelize.authenticate().then(() => {
    console.log('Sequelize : La connexion à la base de données a été établie.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    return process.exit(1);
});

module.exports = sequelize;