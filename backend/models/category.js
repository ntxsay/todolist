const { DataTypes } = require('sequelize');
const database = require('../database.js');

const Category = database.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
        }
    },
    {
        // Other model options go here
        tableName: 'tcategory',
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    },
);

console.log(Category === database.models.Category); 

module.exports = Category