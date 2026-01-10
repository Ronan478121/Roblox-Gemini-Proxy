const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt provided." });

    // Use the STABLE v1 URL to avoid beta expiration issues
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Google API Error:", data.error.message);
            // This sends the clear "Expired" or "Invalid" message back to Roblox
            return res.status(data.error.code || 500).json({ reply: "Google Error: " + data.error.message });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Server Error: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
