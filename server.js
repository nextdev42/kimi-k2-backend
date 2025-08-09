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

app.get("/", (req, res) => {
  res.send("NextDev Academy Kimi K2 backend is running!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message?.trim() || "";
  console.log("Received message:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

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

    const data = await response.json();
    console.log("OpenRouter response:", data);

    res.status(response.status).json(data);

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
