const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt." });

    // MODEL CHANGE: Switching from gemini-1.5-flash to gemini-pro
    // gemini-pro is the most widely supported model for older API keys
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

    try {
        console.log("Calling URL:", url.replace(API_KEY, "HIDDEN_KEY")); // Log for safety

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Google API Error:", data.error);
            return res.status(500).json({ reply: "Google Error: " + data.error.message });
        }

        // Standard response path
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            res.json({ reply: aiText });
        } else {
            res.status(500).json({ reply: "Unexpected API response format." });
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ reply: "Connection Error: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Proxy running gemini-pro on ${PORT}`);
});
