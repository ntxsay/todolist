const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/category/:id', taskController.getTasksByCategoryId);
Router.get('/coming', taskController.getComingTasks);
Router.get('/past', taskController.getPastTasks);
Router.get('/today', taskController.getTodayTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;