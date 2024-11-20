const Task = require('../models/task');
const User = require('../models/user');

exports.getTasks = (req, res) => {
    const query = req.query.where ? JSON.parse(req.query.where) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const select = req.query.select ? JSON.parse(req.query.select) : {};
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const count = req.query.count === 'true';

    if (count) {
        Task.countDocuments(query)
            .then(count => res.json({ message: 'OK', data: count }))
            .catch(err => res.status(500).json({ message: 'Error counting tasks', data: err }));
    } else {
        Task.find(query)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .then(tasks => res.json({ message: 'OK', data: tasks }))
            .catch(err => res.status(500).json({ message: 'Error fetching tasks', data: err }));
    }
};

exports.getTaskById = (req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'Task not found', data: {} });
            }
            res.json({ message: 'OK', data: task });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching task', data: err }));
};

exports.createTask = (req, res) => {
    const { name, description, deadline, assignedUser } = req.body;

    if (!name || !deadline) {
        return res.status(400).json({ message: 'Name and Deadline are required', data: {} });
    }

    const newTask = new Task({
        name,
        description,
        deadline,
        assignedUser: assignedUser || null,
        assignedUserName: assignedUser ? req.body.assignedUserName : 'unassigned'
    });

    newTask.save()
        .then(task => {
            if (assignedUser) {
                User.findById(assignedUser)
                    .then(user => {
                        if (user) {
                            user.pendingTasks.push(task._id);
                            user.save()
                                .then(() => res.status(201).json({ message: 'Task created and assigned', data: task }))
                                .catch(err => res.status(500).json({ message: 'Error updating user', data: err }));
                        } else {
                            res.status(400).json({ message: 'Assigned user not found', data: {} });
                        }
                    })
                    .catch(err => res.status(500).json({ message: 'Error finding user', data: err }));
            } else {
                res.status(201).json({ message: 'Task created', data: task });
            }
        })
        .catch(err => res.status(500).json({ message: 'Error creating task', data: err }));
};

exports.updateTask = (req, res) => {
    const { name, description, deadline, completed, assignedUser } = req.body;

    if (!name || !deadline) {
        return res.status(400).json({ message: 'Name and Deadline are required', data: {} });
    }

    Task.findByIdAndUpdate(req.params.id, { name, description, deadline, completed, assignedUser }, { new: true })
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'Task not found', data: {} });
            }

            if (assignedUser) {
                User.findById(assignedUser)
                    .then(user => {
                        if (user) {
                            user.pendingTasks.push(task._id);
                            user.save();
                        }
                    })
                    .catch(err => res.status(500).json({ message: 'Error updating user', data: err }));
            }

            res.json({ message: 'Task updated', data: task });
        })
        .catch(err => res.status(500).json({ message: 'Error updating task', data: err }));
};

exports.deleteTask = (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'Task not found', data: {} });
            }

            if (task.assignedUser) {
                User.findByIdAndUpdate(task.assignedUser, { $pull: { pendingTasks: task._id } })
                    .then(() => res.json({ message: 'Task and user association removed', data: task }))
                    .catch(err => res.status(500).json({ message: 'Error removing task from user', data: err }));
            } else {
                res.json({ message: 'Task deleted', data: task });
            }
        })
        .catch(err => res.status(500).json({ message: 'Error deleting task', data: err }));
};
