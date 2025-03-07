﻿const {Category, Task} = require('../models');
exports.getAllCategories = (req, res, next) => {
    Category.findAll()
        .then(categories => {
            const categoryPromises = categories.map(category => {

                return Task.count({
                    where: {
                        categoryId: category.id
                    }
                }).then(countTasks => {
                    return {
                        category: category,
                        countTasks: countTasks
                    };
                });
            });
            Promise.all(categoryPromises)
                .then(categoriesWithCounts => {
                    res.status(200).json(categoriesWithCounts);
                })
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Category.findByPk(id, {
            include: Task
        });
        
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.createCategory = (req, res, next) => {
    const category = req.body;
    
    if (category.name === null || category.name === "") {
        return res.status(400).json({message: "Le nom de la catégorie ne peut pas être vide"});
    }
    
    Category.count({
        where: {
            name: category.name
        }
    })
        .then(count => {
            if (count > 0) {
                res.status(400).json({message: "Ce nom existe déjà"});
            } else {
                Category.create(category)
                    .then(category => res.status(201).json(category))
                    .catch(err => {
                        if (err.errors.length > 0) {
                            if (err.errors[0].type === "unique violation" && err.errors[0].path === "color") {
                                res.status(400).json({message: "Cette couleur a déjà été attribuée à une autre catégorie"});
                                return;
                            }
                        }
                        
                        console.error(err);
                        res.status(500).json(err)
                    });
            }
        })
        .catch(err => res.status(500).json(err));
};

exports.updateCategory = (req, res, next) => {
    const category = req.body;
    const id = req.params.id;

    if (category.name === null || category.name === "") {
        return res.status(400).json({message: "Le nom de la catégorie ne peut pas être vide"});
    }

    Category.update(
        {
            name: category.name,
            description: category.description,
            color: category.color
        },
        {where: {id: id}}
    ).then(result => {
        console.log(result);
        console.log(`La catégorie a été mise à jour avec l'id ${id} a été mise à jour.`);
        res.status(200).json(category);
    }).catch(err => {
        if (err.errors.length > 0) {
            if (err.errors[0].type === "unique violation" && err.errors[0].path === "color") {
                res.status(400).json({message: "Cette couleur a déjà été attribuée à une autre catégorie"});
                return;
            }
        }
        
        console.error(err);
        res.status(500).json(err);
    });
}

exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    Category.destroy({
        where: {id: id}
    }).then(result => {
        console.log(`La catégorie a été supprimée avec l'id ${req.params.id}.`);
        res.status(200).json(result);
    }).catch(err => {
        console.error('Erreur lors de la suppression:', err);
        res.status(500).json(err);
    });
};