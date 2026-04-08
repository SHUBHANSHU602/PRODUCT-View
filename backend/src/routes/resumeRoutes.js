const express = require('express');
const { uploadResume } = require('../controllers/resumeController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const { checkResumeLimit } = require('../middleware/freemiumMiddleware');

const router = express.Router();

router.post('/resume/upload', protect, checkResumeLimit, upload.single('resume'), uploadResume);

module.exports = router;