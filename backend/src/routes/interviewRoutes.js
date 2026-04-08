const express = require('express');
const { startInterview, submitAnswer, getInterviewResults } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { checkInterviewLimit } = require('../middleware/freemiumMiddleware');

const router = express.Router();

router.post('/interview/start', protect, checkInterviewLimit, startInterview);
router.post('/interview/answer', protect, submitAnswer);
router.get('/interview/results/:interviewId', protect, getInterviewResults);

module.exports = router;