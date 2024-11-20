const User = require('../models/user');
const Task = require('../models/task');

exports.getUsers = (req, res) => {
    const query = req.query.where ? JSON.parse(req.query.where) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const select = req.query.select ? JSON.parse(req.query.select) : {};
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const count = req.query.count === 'true';

    if (count) {
        User.countDocuments(query)
            .then(count => res.json({ message: 'OK', data: count }))
            .catch(err => res.status(500).json({ message: 'Error counting users', data: err }));
    } else {
        User.find(query)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .then(users => res.json({ message: 'OK', data: users }))
            .catch(err => res.status(500).json({ message: 'Error fetching users', data: err }));
    }
};

exports.getUserById = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }
            res.json({ message: 'OK', data: user });
        })
        .catch(err => res.status(500).json({ message: 'Error fetching user', data: err }));
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required', data: {} });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists', data: {} });
            }

            const newUser = new User({ name, email });
            newUser.save()
                .then(user => res.status(201).json({ message: 'User created', data: user }))
                .catch(err => res.status(500).json({ message: 'Error creating user', data: err }));
        })
        .catch(err => res.status(500).json({ message: 'Error checking user existence', data: err }));
};

exports.updateUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required', data: {} });
    }

    User.findByIdAndUpdate(req.params.id, { name, email }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }
            res.json({ message: 'User updated', data: user });
        })
        .catch(err => res.status(500).json({ message: 'Error updating user', data: err }));
};

exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: {} });
            }

            Task.updateMany({ assignedUser: user._id }, { $set: { assignedUser: null, assignedUserName: 'unassigned' } })
                .then(() => res.json({ message: 'User and assigned tasks removed', data: user }))
                .catch(err => res.status(500).json({ message: 'Error updating tasks', data: err }));
        })
        .catch(err => res.status(500).json({ message: 'Error deleting user', data: err }));
};
