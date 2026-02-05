import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import "../styles/MainPanel.css";
import axios from "axios";

// ✅ Syntax Highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism"; // light theme

const MainPanel = ({ loggedInUser }) => {
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [code, setCode] = useState({ html: "", css: "", js: "" });
  const [activeTab, setActiveTab] = useState("Website");
  const [showSplitLayout, setShowSplitLayout] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const extractCodeBlocks = (text) => {
    const html = text.match(/```html\n([\s\S]*?)```/)?.[1] || "";
    const css = text.match(/```css\n([\s\S]*?)```/)?.[1] || "";
    const js = text.match(/```js\n([\s\S]*?)```/)?.[1] || "";
    return { html, css, js };
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;
    setShowSplitLayout(true);
    setLoading(true);
    setLastPrompt(prompt);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/openai/generate",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const codeBlocks = extractCodeBlocks(res.data.code);
      setCode(codeBlocks);
    } catch (error) {
      console.error("Failed to generate code.");
    }

    setLoading(false);
    setPrompt("");
  };

  const renderPreview = () => {
    if (["HTML", "CSS", "JS"].includes(activeTab)) {
      return (
        <div className="code-scroll">
          <SyntaxHighlighter
            language={activeTab.toLowerCase()}
            style={document.body.classList.contains("dark") ? vscDarkPlus : coy}
            customStyle={{
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              lineHeight: "1.5",
              background: document.body.classList.contains("dark")
                ? "#1e1e1e"
                : "#fafafa",
            }}
          >
            {code[activeTab.toLowerCase()]}
          </SyntaxHighlighter>
        </div>
      );
    }

    if (activeTab === "Website") {
      const linkScript = `
        <script>
          window.onload = function () {
            const anchors = document.querySelectorAll('a');
            anchors.forEach(a => {
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener noreferrer');
            });
          }
        </script>
      `;

      return (
        <iframe
          title="preview"
          className="website-preview"
          style={{ width: "100%", height: "100%", border: "none" }}
          srcDoc={`<!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <style>${code.css}</style>
              </head>
              <body>
                ${code.html}
                <script>${code.js}</script>
                ${linkScript}
              </body>
            </html>`}
        />
      );
    }
  };

  const handleCopy = () => {
    const textToCopy = code[activeTab.toLowerCase()];
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div className="main-panel">
      <div className="top-controls">
        <DarkModeToggle />
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {!showSplitLayout ? (
        <div className="panel-container">
          <h1 className="main-heading">Build, Any Web Application</h1>
          <p className="sub-heading">With Your 24/7 MyGen</p>
          {loggedInUser && (
            <p className="welcome-text">
              Welcome, <span className="username">{loggedInUser}</span>
            </p>
          )}
          <div className="input-section">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="What do you want to build? (e.g., Swiggy clone)"
              className="prompt-input"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              className="generate-button"
              disabled={!prompt.trim() || loading}
            >
              {loading ? "Generating..." : "➤ Generate"}
            </button>
          </div>
        </div>
      ) : (
        <div className="split-layout">
          <div className="left-split">
            <div className="status-message">
              {loading && lastPrompt && (
                <p className="status-text">Creating your website...</p>
              )}
              {!loading && lastPrompt && (
                <p className="status-text">
                  Your web Application is generated ✅
                </p>
              )}
            </div>
            <div className="input-section bottom">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="What do you want to build?"
                className="prompt-input"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                className="generate-button"
                disabled={!prompt.trim() || loading}
              >
                {loading ? "Generating..." : "➤ Generate"}
              </button>
            </div>
          </div>

          <div className="right-split">
            <div className="top-buttons">
              {["HTML", "CSS", "JS", "Website"].map((tab) => (
                <button
                  key={tab}
                  className={`code-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              {["HTML", "CSS", "JS"].includes(activeTab) && (
                <button
                  className={`copy-button ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>

            <div
              className="preview-box"
              style={{ flex: 1, height: "100%", overflow: "hidden" }}
            >
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPanel;
