const categoryModel = require('../models/Category');
const taskModel = require('../models/Task');
exports.getAllCategories = (req, res, next) => {
    categoryModel.findAll()
        .then(categories => {
            const categoryPromises = categories.map(category => {
                
                return taskModel.count({
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
        const category = await categoryModel.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        
        
        const tasks = await taskModel.findAll({
            where: {
                categoryId: category.id
            }
        });

        return res.status(200).json({
            category: category,
            countTasks: tasks.length,
            tasks: tasks
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.createCategory = (req, res, next) => {
    const category = req.body;
    console.log(category);
    categoryModel.count({
        where: {
            name: category.name
        }
    })
        .then(count => {
            if (count > 0) {
                res.status(400).json({message: "Ce nom existe déjà"});
            } else {
                categoryModel.create(category)
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