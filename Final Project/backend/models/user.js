const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sport: { type: String, required: true },
    elo: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now }
});

// Pre-save hook to hash password before saving it to the database
UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified or new
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        this.password = hashedPassword;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);
