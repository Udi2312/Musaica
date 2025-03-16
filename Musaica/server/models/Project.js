const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to user
  filename: { type: String, required: true },
  username: { type: String, required: true }, // Add this line
  processedFiles: [{
    type: String, // Path to processed file (e.g., "processed/trimmed-song.mp3")
    effect: String // "trim", "speed", etc.
  }],
  effects: { type: [String], default: [] }, // e.g., ["reverb", "delay"]
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
