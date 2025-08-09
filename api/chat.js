import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2:free",
        messages: [
          {
            role: "system",
            content:
              "You are a tech assistant for NextDev Academy. ONLY answer tech questions about programming, software, hardware, networking, and IT skills. If asked non-tech questions, respond: 'I specialize in tech topics only.'",
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return res.status(500).json({ error: `OpenRouter API error: ${response.status}`, details: errorText });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Internal error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
