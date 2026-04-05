const { PDFParse } = require('pdf-parse');
const { analyzeResume } = require('../services/aiService');

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

    // Analyze with OpenAI
    const analysis = await analyzeResume(
      pdfData.text,
      req.body.jobDescription
    );

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { uploadResume };