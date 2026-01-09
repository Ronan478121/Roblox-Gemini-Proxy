const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No prompt provided." });
    }

    try {
        // We use gemini-1.5-flash as it is the fastest for a Roblox plugin
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        
        // If it's a model error, this will help us see it in the Roblox output
        res.status(500).json({ reply: "SERVER ERROR: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Proxy active on port ${PORT}`);
});
