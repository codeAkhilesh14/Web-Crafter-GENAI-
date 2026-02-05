const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCode = async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const fullPrompt = `
You are an expert web developer AI.

Your task is to generate a fully functional and complete website using HTML, CSS, and JavaScript based on this request: "${prompt}"

IMPORTANT RULES:

- Always generate COMPLETE and WORKING code.
- Include all UI components, styling, and JavaScript logic.
- Never leave placeholders like "write code here".
- Use realistic dummy data if needed.
- Ensure responsive modern design.
- Use clean professional UI/UX.

STRICT OUTPUT FORMAT:

Return ONLY code blocks in this order:

\`\`\`html
<!-- Complete HTML code -->
\`\`\`

\`\`\`css
/* Complete CSS code */
\`\`\`

\`\`\`js
// Complete JavaScript code
\`\`\`

Do not include ANY explanation text outside the code blocks.
`;

    const result = await model.generateContent(fullPrompt);

    const response = await result.response;
    const code = response.text();

    res.json({ code });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Code generation failed using Gemini API" });
  }
};

module.exports = { generateCode };
