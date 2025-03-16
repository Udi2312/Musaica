const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user
  filename: { type: String, required: true },
  username: { type: String, required: true }, // Add this line
  effects: { type: [String], default: [] }, // e.g., ["reverb", "delay"]
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);