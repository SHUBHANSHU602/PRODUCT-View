const express = require('express');
const { register, login, upgradeToPremium } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upgrade', protect, upgradeToPremium);

module.exports = router;