const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const categoryModel = require('./category.js');
const tableName = 'ttask';
const Task = sequelize.define(
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

Task.belongsTo(categoryModel, {
    foreignKey: 'categoryId',
    targetKey: 'id',
});
Task.sync({ force: false })
    .then(() => {
        return Task.findOrCreate({
            where: { name: 'Déposer les travaux au bureau' },
            defaults: { categoryId: 1, endDate: new Date(2023, 1, 1, 12, 0, 0), description: 'Correspond à des tâches qui concernent le travail' },
        });
    })
    .then(([task, created]) => {
        if (created) {
            console.log('La tâche "Déposer les travaux au bureau" a été créée.');
        } else {
            console.log('La tâche "Déposer les travaux au bureau" existe déjà.');
        }
    })
    .catch(error => console.error(error));

// `sequelize.define` also returns the model
console.log(Task === sequelize.models.Task); // true
module.exports = Task