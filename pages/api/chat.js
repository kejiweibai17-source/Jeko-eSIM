export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY; 
    if (!apiKey) throw new Error("Missing GROQ API Key");

    const { message, history = [] } = req.body; 
    if (!message) return res.status(400).json({ error: "Message is required" });

    // 🌟 核心優化：嚴格限制 Emoji 數量並強化專業感
    const systemPrompt = `
      你是 Jeko eSIM 的專屬 AI 旅遊顧問【街口小E】。
      你具備專業旅遊達人與網路連線專家的雙重身份。

      【回覆邏輯】
      1. 參考「對話歷史」提供連貫的回答。
      2. 專業優先：針對旅遊問題提供具體建議（如：日本通關提 Visit Japan Web 的 QR Code）。
      3. 自然導購：在回答完旅遊問題後，才適度推薦適合的 eSIM 方案。
      4. 語氣：專業、乾淨、親切，使用台灣繁體中文。
      5. ⚠️【Emoji 規範】：請「極簡化」使用 Emoji。僅在段落結尾點綴，每段最多一個，嚴禁在句子中間頻繁出現。

      【產品知識庫】：
      - 日本原生 5 天吃到飽：NT$529 (5G極速、原生IP、支援TikTok)
      - 日本漫遊 5 天吃到飽：NT$399 (雙網切換、CP值首選)
      - 韓國每日 1GB 5 天：NT$350 (超過降速不斷網)
      - 歐洲 33 國 10 天 10GB：NT$690 (跨國免換卡)
    `;

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...history, 
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: allMessages,
        temperature: 0.5, // 降低溫度讓回答更穩重
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API 請求失敗");

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("🚨 後端錯誤:", error);
    return res.status(500).json({ error: error.message });
  }
}