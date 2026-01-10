const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No prompt provided." });
    }

    try {
        // We are using 'gemini-1.5-flash-latest' which is more reliable than the short name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("DEBUG ERROR DETAILS:", error);
        
        // If 1.5-flash fails, try to fall back to the older stable gemini-pro automatically
        try {
            console.log("Attempting fallback to gemini-pro...");
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await fallbackModel.generateContent(message);
            const response = await result.response;
            const text = response.text();
            res.json({ reply: text });
        } catch (fallbackError) {
            res.status(500).json({ reply: "AI Error: " + error.message });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Proxy is Live on port ${PORT}`);
});
