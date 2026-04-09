const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// POST /api/interview/dsa/start
const startDSA = async (req, res, next) => {
  try {
    const { role, company, experience, language } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Role and experience are required'
      });
    }

    const companyContext = company ? `at ${company}` : '';
    const prompt = `You are an expert technical interviewer. Generate a DSA coding problem appropriate for a ${role} ${companyContext} with ${experience} experience level.

The problem should be realistic — the kind asked in actual tech interviews.

Choose difficulty based on experience:
- "fresher" or "1-3" → Easy or Medium
- "3-5" → Medium
- "5+" → Medium or Hard

Respond ONLY in pure JSON with no extra text, no markdown, no backticks:
{
  "title": "<problem title>",
  "difficulty": "<Easy|Medium|Hard>",
  "description": "<detailed problem statement, 3-5 paragraphs>",
  "examples": [
    { "input": "<input description>", "output": "<expected output>", "explanation": "<brief explanation>" },
    { "input": "<input description>", "output": "<expected output>", "explanation": "<brief explanation>" }
  ],
  "constraints": ["<constraint 1>", "<constraint 2>", "<constraint 3>"],
  "boilerplate": {
    "javascript": "<starter function code>",
    "python": "<starter function code>",
    "java": "<starter class/function code>",
    "cpp": "<starter function code>"
  },
  "hints": ["<hint 1>", "<hint 2>", "<hint 3>"],
  "optimalApproach": "<brief description of optimal approach without full code>"
}`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const rawText = response.choices[0].message.content.trim();
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const problem = JSON.parse(cleaned);

    res.status(200).json({
      success: true,
      ...problem
    });

  } catch (err) {
    console.error('DSA start error:', err);
    next(err);
  }
};

// POST /api/interview/dsa/chat
const chatDSA = async (req, res, next) => {
  try {
    const { message, problemContext, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const systemPrompt = `You are Alex, an AI technical interviewer at a top tech company. You are conducting a DSA coding interview.

CURRENT PROBLEM CONTEXT:
Title: ${problemContext?.title || 'Unknown'}
Difficulty: ${problemContext?.difficulty || 'Unknown'}
Description: ${problemContext?.description || 'Unknown'}

YOUR BEHAVIOR:
- Be professional, encouraging, and constructive
- If the candidate asks about the problem, help clarify without giving away the solution
- If the candidate discusses their approach, evaluate it — ask about time/space complexity, edge cases
- If the candidate shares code, review it for correctness, efficiency, and style
- Give hints when asked, but progressively — don't reveal the full solution
- Ask follow-up questions to probe deeper understanding
- Be concise — keep responses under 150 words unless explaining something complex
- Use a conversational, friendly tone

CONVERSATION FLOW:
1. First, let candidate read and understand the problem
2. Ask them to discuss their approach before coding
3. During coding, ask about their thought process
4. After submission, review their solution and discuss optimizations`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = response.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      reply
    });

  } catch (err) {
    console.error('DSA chat error:', err);
    next(err);
  }
};

module.exports = { startDSA, chatDSA };
