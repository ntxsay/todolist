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
        console.log('La synchronisation des catégories a été effectuée.');
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
        console.log('La synchronisation des tâches a été effectuée.');
    })
    .catch(error => console.error(error));




module.exports = {
    Category,
    Task
};