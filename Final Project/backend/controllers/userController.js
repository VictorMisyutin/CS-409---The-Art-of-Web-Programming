const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare the entered password with the stored hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords' });
                }

                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Create JWT Token
                const token = jwt.sign(
                    { userId: user._id },
                    'your_jwt_secret', // Use a secret key for signing the token
                    { expiresIn: '1h' } // The token will expire in 1 hour
                );

                res.json({
                    message: 'Login successful',
                    data: {
                        token, // Send the token to the client
                        user: {
                            name: user.name,
                            email: user.email,
                            sport: user.sport,
                            elo: user.elo
                        }
                    }
                });
            });
        })
        .catch(err => res.status(500).json({ message: 'Error logging in', data: err }));
};


exports.createUser = (req, res) => {
    const { name, email, password, sport, elo } = req.body;

    if (!name || !email || !password || !sport || !elo) {
        return res.status(400).json({ message: 'Name, Email, Password, and Sport are required', data: {} });
    }

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists', data: {} });
            }

            const newUser = new User({ name, email, password, sport, elo }); // Include sport here
            newUser.save()
                .then(user => res.status(201).json({ message: 'User created', data: user }))
                .catch(err => res.status(500).json({ message: 'Error creating user', data: err }));
        })
        .catch(err => res.status(500).json({ message: 'Error checking user existence', data: err }));
};


exports.updateUser = (req, res) => {
    const { name, email, password, sport, elo } = req.body;

    if (!name || !email || !password || !sport || !elo) {
        return res.status(400).json({ message: 'Name, Email, Password, Sport, elo are required', data: {} });
    }

    User.findByIdAndUpdate(req.params.id, { name, email, password, sport, elo }, { new: true })
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
            res.json({ message: 'User deleted', data: {} }); // Send response after deletion
        })
        .catch(err => res.status(500).json({ message: 'Error deleting user', data: err }));
};
