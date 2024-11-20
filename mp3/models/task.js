var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedUserName: { type: String, default: 'unassigned' },
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
