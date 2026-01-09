const express = require('express');
// We are now using the NEW 2026 SDK
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

// Initialize the new client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;
        
        // 2026 Stable Model Name
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message }] }]
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
