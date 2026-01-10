const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize the API with a check
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is not set in Render Environment Variables!");
}
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No prompt provided." });
    }

    try {
        // Using 1.5-flash for speed and lower latency
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // If the AI returns an empty response (usually due to safety filters)
        if (!text) {
            res.json({ reply: "The AI didn't provide an answer. Try rephrasing your request." });
        } else {
            res.json({ reply: text });
        }
    } catch (error) {
        console.error("DEBUG ERROR DETAILS:", error);
        
        // This sends the actual error back to Roblox so you can see it in your plugin
        res.status(500).json({ reply: "SERVER ERROR: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Proxy is Live on port ${PORT}`);
});
