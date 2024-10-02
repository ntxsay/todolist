const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/count-status', taskController.countStatusTasks);
router.get('/status', taskController.findTasksByStatus);
router.get('/search', taskController.findTasks);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/category/:id', taskController.getTasksByCategoryId);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;