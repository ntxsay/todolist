const {Category, Task} = require('../models');
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