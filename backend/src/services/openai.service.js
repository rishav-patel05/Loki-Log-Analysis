import OpenAI from "openai";

export const analyzeLogs = async (logs) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not loaded");
  }

  if (!logs || logs.length === 0) {
    return {
      summary: "No logs available for analysis",
      severity: "LOW",
      rootCauses: [],
      impactedAreas: [],
      suggestedActions: []
    };
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://kodekey.ai.kodekloud.com/v1"
  });

  const logText = logs
    .map(l => `[${l.timestamp}] ${l.message}`)
    .join("\n");

  const prompt = `
You are a Site Reliability Engineer.

Return ONLY valid JSON in this exact structure:

{
  "summary": "",
  "severity": "LOW | MEDIUM | HIGH",
  "rootCauses": [],
  "impactedAreas": [],
  "suggestedActions": []
}

Logs:
${logText}
`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-4o-2024-11-20",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  let content = response.choices[0].message.content;

  // 🔥 HARD CLEAN (very important)
  content = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ AI JSON parse failed:", content);

    return {
      summary: content,
      severity: "MEDIUM",
      rootCauses: [],
      impactedAreas: [],
      suggestedActions: []
    };
  }
};
