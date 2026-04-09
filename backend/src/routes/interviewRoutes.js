const express = require('express');
const { startInterview, submitAnswer, getInterviewResults } = require('../controllers/interviewController');
const { startDSA, chatDSA, evaluateDSA } = require('../controllers/dsaController');
const { protect } = require('../middleware/authMiddleware');
const { checkInterviewLimit } = require('../middleware/freemiumMiddleware');

const router = express.Router();

router.post('/interview/start', protect, checkInterviewLimit, startInterview);
router.post('/interview/answer', protect, submitAnswer);
router.get('/interview/results/:interviewId', protect, getInterviewResults);

// DSA Interview routes
router.post('/interview/dsa/start', protect, startDSA);
router.post('/interview/dsa/chat', protect, chatDSA);
router.post('/interview/dsa/evaluate', protect, evaluateDSA);

module.exports = router;