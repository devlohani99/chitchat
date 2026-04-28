export const generateAIReply = async (prompt) => {
  const key = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  if (!key) {
    return "Set GROQ_API_KEY to enable AI responses.";
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a concise and helpful chat assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    return "I could not generate a response right now.";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I could not generate a response right now.";
};
