const { DataTypes } = require('sequelize');
const database = require('../database.js');

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
            unique: false,
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
        tableName: 'ttask'
    },
);


// `sequelize.define` also returns the model
console.log(Task === database.models.Task); // true
module.exports = Task