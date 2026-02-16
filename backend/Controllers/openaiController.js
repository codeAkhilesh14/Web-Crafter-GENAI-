// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateCode = async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

//     const fullPrompt = `
// You are an expert web developer AI.

// Your task is to generate a fully functional and complete website using HTML, CSS, and JavaScript based on this request: "${prompt}"

// IMPORTANT RULES:

// - Always generate COMPLETE and WORKING code.
// - Include all UI components, styling, and JavaScript logic.
// - Never leave placeholders like "write code here".
// - Use realistic dummy data if needed.
// - Ensure responsive modern design.
// - Use clean professional UI/UX.

// STRICT OUTPUT FORMAT:

// Return ONLY code blocks in this order:

// \`\`\`html
// <!-- Complete HTML code -->
// \`\`\`

// \`\`\`css
// /* Complete CSS code */
// \`\`\`

// \`\`\`js
// // Complete JavaScript code
// \`\`\`

// Do not include ANY explanation text outside the code blocks.
// `;

//     const result = await model.generateContent(fullPrompt);

//     const response = await result.response;
//     const code = response.text();

//     res.json({ code });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     res.status(500).json({ error: "Code generation failed using Gemini API" });
//   }
// };

// module.exports = { generateCode };

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
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

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
