const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');
const taskModel = require('./task.js');


const Category = sequelize.define(
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
    },
);

Category.sync({ force: false })
    .then(() => {
        return Category.findOrCreate({
            where: { name: 'Travail' },
            defaults: { color: '#ff1493', description: 'Correspond à des tâches qui concernent le travail' },
        });
    })
    .then(([category, created]) => {
        if (created) {
            console.log('La catégorie "Travail" a été créée.');
        } else {
            console.log('La catégorie "Travail" existe déjà.');
        }
    })
    .catch(error => console.error(error));

// `sequelize.define` also returns the model
console.log(Category === sequelize.models.Category); 

module.exports = Category