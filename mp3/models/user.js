var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pendingTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    dateCreated: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('User', UserSchema);
