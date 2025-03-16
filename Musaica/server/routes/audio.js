const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const audioController = require('../controllers/audioController');
const { uploadAudio, getProjects } = audioController;
// Upload Audio
router.post('/upload', auth, uploadAudio);

// Get user's projects
router.get('/projects', audioController.getProjects);

module.exports = router;