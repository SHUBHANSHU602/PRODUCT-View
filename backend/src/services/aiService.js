const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const analyzeResume = async (resumeText, jobDescription) => {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume against the job description.
Respond ONLY in pure JSON format with no extra text, no markdown, no backticks.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return exactly this JSON structure:
{
  "atsScore": <number 0-100>,
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionFeedback": {
    "education": "<feedback>",
    "experience": "<feedback>",
    "skills": "<feedback>",
    "projects": "<feedback>"
  },
  "improvements": ["suggestion1", "suggestion2", "suggestion3"]
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

module.exports = { analyzeResume };