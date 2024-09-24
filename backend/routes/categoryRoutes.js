const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);

module.exports = router;