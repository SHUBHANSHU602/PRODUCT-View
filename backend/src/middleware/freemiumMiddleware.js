const plans = require('../config/plans');

const checkResumeLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const plan = plans[user.plan];

    if (user.resumeAnalysisCount >= plan.resumeAnalysisLimit) {
      return res.status(403).json({
        success: false,
        message: `You have reached your ${user.plan} plan limit of ${plan.resumeAnalysisLimit} resume analyses. Please upgrade to premium.`,
        upgradeRequired: true
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

const checkInterviewLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const plan = plans[user.plan];

    if (user.interviewSessionCount >= plan.interviewLimit) {
      return res.status(403).json({
        success: false,
        message: `You have reached your ${user.plan} plan limit of ${plan.interviewLimit} interviews. Please upgrade to premium.`,
        upgradeRequired: true
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkResumeLimit, checkInterviewLimit };