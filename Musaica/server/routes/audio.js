const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { trimAudio, applyEffect } = require('../controllers/audioController');
const audioController = require('../controllers/audioController');
const { uploadAudio, getProjects } = audioController;
// Upload Audio
router.post('/upload', auth, uploadAudio);

// Get user's projects
router.get('/projects', audioController.getProjects);
// Trim audio
router.post('/trim', auth, trimAudio);

// Apply effect
router.post('/effect', auth, applyEffect);

module.exports = router;
