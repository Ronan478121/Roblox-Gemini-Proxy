const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt." });

    // FORCE V1BETA and GEMINI 2.0 FLASH
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
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

        // If Google sends back an error, we send the WHOLE error to Roblox
        if (data.error) {
            console.error("GOOGLE_ERROR:", data.error);
            return res.status(500).json({ 
                reply: `Google Error: ${data.error.message} (Status: ${data.error.status})` 
            });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });

    } catch (error) {
        console.error("FETCH_ERROR:", error);
        res.status(500).json({ reply: "Connection Error: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Proxy running on port ${PORT}`);
});
