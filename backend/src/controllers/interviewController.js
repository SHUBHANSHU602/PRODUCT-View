const Interview = require('../models/Interview');
const { generateQuestions, evaluateAnswer } = require('../services/interviewService');

// Generate interview questions
const startInterview = async (req, res, next) => {
  try {
    const { jobRole, jobDescription } = req.body;

    if (!jobRole || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job role and job description are required'
      });
    }

    const questions = await generateQuestions(jobRole, jobDescription);

    const interview = await Interview.create({
      userId: req.user._id,
      jobRole,
      jobDescription,
      questions,
      status: 'questions_generated'
    });

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      interviewId: interview._id,
      questions
    });

  } catch (err) {
    next(err);
  }
};

// Submit answer for a question
const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex, userAnswer } = req.body;

    if (!interviewId || questionIndex === undefined || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'interviewId, questionIndex and userAnswer are required'
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const question = interview.questions[questionIndex];
    const evaluation = await evaluateAnswer(question, userAnswer, interview.jobRole);

    interview.answers.push({
      question,
      userAnswer,
      feedback: evaluation.feedback,
      score: evaluation.score
    });

    // If all questions answered mark as completed
    if (interview.answers.length === interview.questions.length) {
      const totalScore = interview.answers.reduce((sum, a) => sum + a.score, 0);
      interview.overallScore = Math.round(totalScore / interview.answers.length);
      interview.status = 'completed';

      // Increment user interview count
      req.user.interviewSessionCount += 1;
      await req.user.save();
    } else {
      interview.status = 'in_progress';
    }

    await interview.save();

    res.status(200).json({
      success: true,
      evaluation,
      overallScore: interview.overallScore,
      status: interview.status,
      answeredCount: interview.answers.length,
      totalQuestions: interview.questions.length
    });

  } catch (err) {
    next(err);
  }
};

// Get interview results
const getInterviewResults = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      interview
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { startInterview, submitAnswer, getInterviewResults };