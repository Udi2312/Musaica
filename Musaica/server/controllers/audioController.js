const { trimAudio, applyEffect } = require('../utils/audioProcessor');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');

exports.uploadAudio = async (req, res) => {
    console.log('\n=== New Upload Request ===');
    console.log('Headers:', req.headers);
    console.log('Body Keys:', Object.keys(req.body));
    
    try {
        // File validation
        if (!req.files?.audio) {
            console.error('File Error: No audio file uploaded');
            return res.status(400).json({ error: 'No audio file uploaded' });
        }
        
    // Authentication Logic
    let user;
    if (req.headers['x-auth-token']) {
        console.log('Attempting token authentication...');
        try {
            const decoded = jwt.verify(req.headers['x-auth-token'], process.env.JWT_SECRET);
            user = await User.findById(decoded.id);
            console.log(`Token Auth Success. User: ${user.username} (${user.email})`);
        } catch (tokenErr) {
            console.error('Token Auth Failed:', tokenErr.message);
            return res.status(401).json({ 
                error: 'Token authentication failed',
                details: tokenErr.message 
            });
        }
    } else if (req.body.email && req.body.password) {
        console.log('Attempting email/password authentication...');
        try {
            user = await User.findOne({ email: req.body.email });
            if (!user) throw new Error('User not found');
            
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) throw new Error('Password mismatch');
            
            console.log(`Email Auth Success. User: ${user.username} (${user.email})`);
        } catch (authErr) {
            console.error('Email Auth Failed:', authErr.message);
            return res.status(401).json({ 
                error: 'Email/password authentication failed',
                details: authErr.message 
            });
        }
    } else {
        console.error('Auth Error: No credentials provided');
        return res.status(401).json({ error: 'No authentication provided' });
    }
    
    // File Handling
    console.log(`Uploading file for: ${user.username}`);
    const file = req.files.audio;
    const filePath = `${__dirname}/../uploads/${file.name}`;
    console.log(`Saving file to: ${filePath}`);
    console.log(`Saving file for: ${user.username}`);

    await file.mv(filePath);
    console.log('File saved successfully');
    
    // Database Operation
    const project = new Project({
        user: user._id,
        filename: file.name,
        username: user.username 
    });
    await project.save();
    console.log('Project saved to DB:', project);
    console.log(`Project saved by ${user.username}:`, project);
    
    res.json({ 
        success: true,
        filename: file.name,
        user: user.username
    });

} catch (err) {
    console.error('Fatal Error:', err.stack);  // Full error stack
    res.status(500).json({
        error: 'Server error',
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}
};
// Add this to the existing file
// controllers/audioController.js
exports.getProjects = async (req, res) => {
    console.log('\n=== Project Fetch Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  
    try {
      let user;
  
      // Token-based authentication
      if (req.headers['x-auth-token']) {
        const token = req.headers['x-auth-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
        console.log(`Token Auth Success: ${user.username}`);
      } 
      // Email/password authentication
      else if (req.body.email && req.body.password) {
        user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('User not found');
        
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) throw new Error('Password mismatch');
        console.log(`Email Auth Success: ${user.username}`);
      } 
      // No credentials
      else {
        throw new Error('No authentication provided');
      }
  
      // Fetch projects
      const projects = await Project.find({ user: user._id }).sort({ createdAt: -1 });
      console.log(`Found ${projects.length} projects for ${user.username}`);
      res.json(projects);
  
    } catch (err) {
      console.error('Project Fetch Error:', err.message);
      res.status(500).json({ 
        error: 'Failed to fetch projects',
        details: err.message 
      });
    }
  };

// Trim audio endpoint
exports.trimAudio = async (req, res) => {
  try {
    const { filename, start, duration } = req.body;
    const inputPath = path.join(__dirname, '../uploads', filename);
    const outputPath = path.join(__dirname, '../processed', `trimmed_${filename}`);

    await trimAudio(inputPath, outputPath, start, duration);
    
    // Update project with processed file
    await Project.findOneAndUpdate(
      { user: req.user._id, filename },
      { $push: { processedFiles: { path: `trimmed_${filename}`, effect: 'trim' } } }
    );

    res.json({ success: true, processedFile: `trimmed_${filename}` });
  } catch (err) {
    console.error('Trim Error:', err);
    res.status(500).json({ error: 'Audio trim failed', details: err.message });
  }
};

// Apply effect endpoint
exports.applyEffect = async (req, res) => {
  try {
    const { filename, effectType, value } = req.body;
    const inputPath = path.join(__dirname, '../uploads', filename);
    const outputFilename = `${effectType}_${value}_${filename}`;
    const outputPath = path.join(__dirname, '../processed', outputFilename);

    await applyEffect(inputPath, outputPath, effectType, value);
    
    // Update project
    await Project.findOneAndUpdate(
      { user: req.user._id, filename },
      { $push: { processedFiles: { path: outputFilename, effect: effectType } } }
    );

    res.json({ success: true, processedFile: outputFilename });
  } catch (err) {
    console.error('Effect Error:', err);
    res.status(500).json({ error: 'Effect failed', details: err.message });
  }
};
