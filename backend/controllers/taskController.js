const {Task } = require('../models');
const {Op} = require('sequelize');

exports.getAllTasks = (req, res, next) => {
    Task.findAll()
        .then(books => res.status(200).json(books))
        .catch(err => res.status(500).json(err));
};

exports.getTaskById = (req, res, next) => {
    Task.findByPk(req.params.id)
        .then(task => res.status(200).json(task))
        .catch(error => res.status(404).json({error}));
};

exports.getTasksByCategoryId = (req, res, next) => {
    Task.findAll({
        where: {
            categoryId: req.params.id
        }
    })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json(error));
};

exports.getComingTasks = (req, res, next) => {
    Task.findAll({
        where: {
            beginDate: {
                [Op.gt]: new Date()
            }
        }
    })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json(error));
};

exports.getPastTasks = (req, res, next) => {
    Task.findAll({
        where: {
            endDate: {
                [Op.lt]: new Date()
            }
        }
    })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json(error));
};

exports.getTodayTasks = (req, res, next) => {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); 

    Task.findAll({
        where: {
            beginDate: {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            }
        }
    })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json(error));
};

exports.countStatusTasks = async (req, res, next) => {
    try {
        const countComingTasks = await Task.count({
            where: {
                beginDate: {
                    [Op.gt]: new Date()
                }
            }
        });
        const countPastTasks = await Task.count({
            where: {
                endDate: {
                    [Op.lt]: new Date()
                }
            }
        });
        const countTodayTasks = await Task.count({
            where: {
                beginDate: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                    [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        });
        
        res.status(200).json([
            {name: "coming", countTasks: countComingTasks, displayName: "À venir"},
            {name: "today", countTasks: countTodayTasks, displayName: "Aujourd'hui"},
            {name: "past", countTasks: countPastTasks, displayName: "Passées"}
        ]);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};


exports.createTask = (req, res, next) => {
    const task = req.body;
    
    const validation = validateAddingOrUpdatingTask(task);
    if (!validation.isValid)
        return res.status(400).json({message: validation.message});
    
    Task.create(task)
        .then(task => res.status(201).json(task))
        .catch(error => res.status(500).json(error));
};

exports.updateTask = (req, res, next) => {
    const task = req.body;
    const id = req.params.id;
    
    //validation des champs
    const validation = validateAddingOrUpdatingTask(task);
    if (validation.isValid === false)
        return res.status(400).json({message: validation.message});

    Task.update(
        { 
            name: task.name,
            beginDate: task.beginDate,
            endDate: task.endDate,
            description: task.description,
            categoryId: task.categoryId
        },
        { where: { id: id } }
    ).then(result => {
        console.log(`La tâche a été nommée "${task.name}" avec l'id ${id} a été mise à jour.`);
        res.status(200).json(task);
    }).catch(err => {
        console.error('Erreur lors de la mise à jour:', err);
        res.status(500).json(err);
    });
};

exports.deleteTask = (req, res, next) => {
    const id = req.params.id;

    Task.destroy({
        where: {id: id}
    }).then(result => {
        console.log(`La tâche a été supprimée avec l'id ${id}.`);
        res.status(200).json(result);
    }).catch(err => {
        console.error('Erreur lors de la suppression:', err);
        res.status(500).json(err);
    });
};

function validateAddingOrUpdatingTask(task) {
    if (task.name === null || task.name === "") {
        return {
            isValid: false,
            message: "Le nom de la tâche ne peut pas être vide"
        };
    }

    if ((task.categoryId <= 0)) {
        return {
            isValid: false,
            message: "Vous devez sélectionner une catégorie"
        };
    }

    if (task.beginDate === null || task.beginDate === "") {
        return {
            isValid: false,
            message: "La date de début ne peut pas être vide"
        };
    }

    if (task.endDate === null || task.endDate === "") {
        return {
            isValid: false,
            message: "La date de fin ne peut pas être vide"
        };
    }

    if (task.beginDate > task.endDate) {
        return {
            isValid: false,
            message: "La date de début doit être inférieure à la date de fin"
        };
    }

    if (task.beginDate === task.endDate) {
        return {
            isValid: false,
            message: "La date de début et la date de fin ne peuvent pas être identiques"
        };
    }

    return {
        isValid: true,
        message: ""
    };
}
