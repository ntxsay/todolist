const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            // allowNull defaults to true
        },
    },
    {
        // Other model options go here
        freezeTableName: true,
    },
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
module.exports = User