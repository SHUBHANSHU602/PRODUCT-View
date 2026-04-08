const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateQuestions = async (jobRole, jobDescription) => {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert technical interviewer.

Generate 5 interview questions for the following role and job description.
Mix of technical and behavioral questions.
Respond ONLY in pure JSON format with no extra text, no markdown, no backticks.

Job Role: ${jobRole}
Job Description: ${jobDescription}

Return exactly this JSON structure:
{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}
        `
      }
    ],
    temperature: 0.7
  });

  const rawText = response.choices[0].message.content.trim();
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return parsed.questions;
};

const evaluateAnswer = async (question, userAnswer, jobRole) => {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert technical interviewer evaluating a candidate's answer.
Respond ONLY in pure JSON format with no extra text, no markdown, no backticks.

Job Role: ${jobRole}
Question: ${question}
Candidate's Answer: ${userAnswer}

Return exactly this JSON structure:
{
  "score": <number 0-10>,
  "feedback": "<detailed feedback on what was good and what was missing>",
  "idealAnswer": "<brief description of what a perfect answer would include>"
}
        `
      }
    ],
    temperature: 0.3
  });

  const rawText = response.choices[0].message.content.trim();
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return parsed;
};

module.exports = { generateQuestions, evaluateAnswer };