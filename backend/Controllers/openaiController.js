const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

require("dotenv").config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",   // completely free and fast
  temperature: 0.7,
});

const generateCode = async (req, res) => {
  const { prompt } = req.body;

  try {
    const systemPrompt = `
You are an expert web developer AI.

Your task is to generate a fully functional and complete website using HTML, CSS, and JavaScript.

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

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(prompt),
    ]);

    res.json({ code: response.content });

  } catch (error) {
    console.error("LangChain Groq Error:", error);
    res.status(500).json({
      error: "Code generation failed using LangChain + Groq",
    });
  }
};

module.exports = { generateCode };
