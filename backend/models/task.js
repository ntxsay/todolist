const { DataTypes } = require('sequelize');
const database = require('../database.js');
const categoryModel = require('./category.js');
const tableName = 'ttask';
const Task = database.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Category',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            
        },
        beginDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        // Model attributes are defined here
        description: {
            type: DataTypes.STRING,
        }
    },
    {
        // Other model options go here
        tableName: tableName,
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    },
);


// `sequelize.define` also returns the model
console.log(Task === database.models.Task); // true
module.exports = Task