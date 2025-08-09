import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("FATAL: OPENROUTER_API_KEY environment variable missing!");
  process.exit(1);
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message?.trim() || "";

  // Call Kimi K2 API directly (model handles filtering)
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2:free",
        messages: [
          {
            role: "system",
            content: "You are a tech assistant for NextDev Academy. ONLY answer questions about programming, software, hardware, networking, and IT skills. If asked non-tech questions, respond: 'I specialize in tech topics only.'"
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    // Forward OpenRouter's response directly
    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
