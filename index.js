const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt." });

    // We call the STABLE v1 API directly via URL
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

        // Check if Google returned an error
        if (data.error) {
            console.error("Google API Error:", data.error);
            return res.status(500).json({ reply: "Google Error: " + data.error.message });
        }

        // Extract the text from the specific Google response format
        const aiText = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiText });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ reply: "Connection Error: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Direct Fetch Proxy Active on ${PORT}`);
});
