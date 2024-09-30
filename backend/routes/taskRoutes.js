const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/coming', taskController.getComingTasks);
router.get('/past', taskController.getPastTasks);
router.get('/today', taskController.getTodayTasks);
router.get('/status', taskController.countStatusTasks);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/category/:id', taskController.getTasksByCategoryId);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;