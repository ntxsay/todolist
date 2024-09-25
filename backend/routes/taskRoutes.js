const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/category/:id', taskController.getTasksByCategoryId);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);

module.exports = router;