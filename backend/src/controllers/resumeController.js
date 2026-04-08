const { PDFParse } = require('pdf-parse');
const { analyzeResume } = require('../services/aiService');
const ResumeAnalysis = require('../models/ResumeAnalysis');

async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    if (!req.body.jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description is required"
      });
    }

    // Extract text from PDF
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    await parser.destroy();

    // Analyze with AI
    const analysis = await analyzeResume(
      pdfData.text,
      req.body.jobDescription
    );

    // Save to MongoDB if user is logged in
    if (req.user) {
      await ResumeAnalysis.create({
        userId: req.user._id,
        jobDescription: req.body.jobDescription,
        extractedText: pdfData.text,
        analysis
      });

      // Increment user analysis count
      req.user.resumeAnalysisCount += 1;
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { uploadResume };