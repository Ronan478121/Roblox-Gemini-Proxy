const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize the API
// We add "apiVersion: 'v1'" to force it out of the buggy beta mode
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt." });

    try {
        // We use "gemini-1.5-flash" but call it through the stable v1 channel
        // specifying the apiVersion in getGenerativeModel can help
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            apiVersion: 'v1' 
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("--- FINAL DEBUG ---");
        console.error(error.message);
        
        // If it STILL fails, it might be a regional block on 'flash'
        // This fallback uses the classic 'gemini-pro' name
        try {
            const fallback = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await fallback.generateContent(message);
            const response = await result.response;
            res.json({ reply: response.text() });
        } catch (err2) {
            res.status(500).json({ reply: "Connection Error: " + error.message });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server active on ${PORT}`);
});
