const {Task } = require('../models');

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

exports.createTask = (req, res, next) => {
    const task = req.body;
    
    if (task.name === null || task.name === "") {
        return res.status(400).json({message: "Le nom de la tâche ne peut pas être vide"});
    }
    
    if ((task.categoryId <= 0)) {
        return res.status(400).json({message: "Vous devez sélectionner une catégorie"});
    }
    
    if (task.beginDate === null || task.beginDate === "") {
        return res.status(400).json({message: "La date de début ne peut pas être vide"});
    }
    
    if (task.endDate === null || task.endDate === "") {
        return res.status(400).json({message: "La date de fin ne peut pas être vide"});
    }
    
    if (task.beginDate > task.endDate) {
        return res.status(400).json({message: "La date de début doit être inférieure à la date de fin"});
    }
    
    if (task.beginDate === task.endDate) {
        return res.status(400).json({message: "La date de début et la date de fin ne peuvent pas être identiques"});
    }
    
    Task.create(task)
        .then(task => res.status(201).json(task))
        .catch(error => res.status(500).json(error));
};

exports.updateTask = (req, res, next) => {
    const task = req.body;
    const id = req.params.id;
    
    if (task.name === null || task.name === "") {
        return res.status(400).json({message: "Le nom de la tâche ne peut pas être vide"});
    }
    
    if ((task.categoryId <= 0)) {
        return res.status(400).json({message: "Vous devez sélectionner une catégorie"});
    }
    
    if (task.beginDate === null || task.beginDate === "") {
        return res.status(400).json({message: "La date de début ne peut pas être vide"});
    }
    
    if (task.endDate === null || task.endDate === "") {
        return res.status(400).json({message: "La date de fin ne peut pas être vide"});
    }
    
    if (task.beginDate > task.endDate) {
        return res.status(400).json({message: "La date de début doit être inférieure à la date de fin"});
    }
    
    if (task.beginDate === task.endDate) {
        return res.status(400).json({message: "La date de début et la date de fin ne peuvent pas être identiques"});
    }

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
        console.log(`La tâche a été nommée "${task.name}" avec l'id ${req.params.id} a été mise à jour.`);
        res.status(200).json(result);
    }).catch(err => {
        console.error('Erreur lors de la mise à jour:', err);
        res.status(500).json(err);
    });
};