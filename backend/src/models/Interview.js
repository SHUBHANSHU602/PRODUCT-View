const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  feedback: String,
  score: Number
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  questions: [String],
  answers: [answerSchema],
  overallScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['questions_generated', 'in_progress', 'completed'],
    default: 'questions_generated'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);