const ResumeAnalysis = require('../models/ResumeAnalysis');
const Interview = require('../models/Interview');

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all resume analyses
    const resumeAnalyses = await ResumeAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .select('analysis.atsScore jobDescription createdAt');

    // Get all interviews
    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 })
      .select('jobRole overallScore status createdAt answers');

    // Calculate stats
    const avgAtsScore = resumeAnalyses.length
      ? Math.round(resumeAnalyses.reduce((sum, r) => sum + r.analysis.atsScore, 0) / resumeAnalyses.length)
      : 0;

    const avgInterviewScore = interviews.length
      ? Math.round(interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length)
      : 0;

    const completedInterviews = interviews.filter(i => i.status === 'completed').length;

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          name: req.user.name,
          email: req.user.email,
          plan: req.user.plan,
          resumeAnalysisCount: req.user.resumeAnalysisCount,
          interviewSessionCount: req.user.interviewSessionCount
        },
        stats: {
          totalResumeAnalyses: resumeAnalyses.length,
          totalInterviews: interviews.length,
          completedInterviews,
          avgAtsScore,
          avgInterviewScore
        },
        recentResumeAnalyses: resumeAnalyses.slice(0, 5),
        recentInterviews: interviews.slice(0, 5)
      }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };