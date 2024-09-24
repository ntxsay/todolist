const taskModel = require('../models/task');

exports.getAllTasks = (req, res, next) => {
    taskModel.findAll()
        .then(books => res.status(200).json(books))
        .catch(err => res.status(500).json(err));
};

exports.getTaskById = (req, res, next) => {
    taskModel.findByPk(req.params.id)
        .then(task => res.status(200).json(task))
        .catch(error => res.status(404).json({error}));
};

exports.getTasksByCategoryId = (req, res, next) => {
    taskModel.findAll({
        where: {
            categoryId: req.params.id
        }
    })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json(error));
};

exports.createTask = (req, res, next) => {
    const task = req.body;
    taskModel.create(task)
        .then(task => res.status(201).json(task))
        .catch(error => res.status(500).json(error));
};