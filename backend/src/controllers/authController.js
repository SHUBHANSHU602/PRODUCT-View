const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error('All fields are required');
      error.statusCode = 400;
      throw error;
    }

    const result = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      ...result
    });

  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...result
    });

  } catch (err) {
    next(err);
  }
};

const upgradeToPremium = async (req, res, next) => {
  try {
    req.user.plan = 'premium';
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Upgraded to premium successfully',
      plan: req.user.plan
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, upgradeToPremium };