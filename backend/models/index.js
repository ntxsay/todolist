const Category = require('./category');
const Task = require('./task');

Category.hasMany(Task, 
    { 
        foreignKey: 'categoryId',
        onDelete: 'CASCADE',
    });
Task.belongsTo(Category, 
    { 
        foreignKey: 'categoryId' ,
        onDelete: 'CASCADE',
    });

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

Task.sync({ force: false })
    .then(() => {
        return Task.findOrCreate({
            where: { name: 'Déposer les travaux au bureau' },
            defaults: { categoryId: 1, endDate: new Date(2024, 12, 1, 12, 0, 0), description: 'Correspond à des tâches qui concernent le travail' },
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

module.exports = {
    Category,
    Task
};