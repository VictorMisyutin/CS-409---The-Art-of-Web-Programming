const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

router.route('/users')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/users/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/tasks')
    .get(taskController.getTasks)
    .post(taskController.createTask);

router.route('/tasks/:id')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;
