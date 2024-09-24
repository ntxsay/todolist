const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js');

const tableName = 'tstatus';
const Status = sequelize.define(
    'Status',
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
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // Model attributes are defined here
        description: {
            type: DataTypes.STRING,
        }
    },
    {
        // Other model options go here
        tableName: tableName,
    },
);

Status.sync({ force: false })
    .then(() => {
        console.log(`La table ${tableName} a été mise à jour`);
    })
    .catch(error => {
        console.error(error);
    });

// `sequelize.define` also returns the model
console.log(Status === sequelize.models.Status); // true
module.exports = Status