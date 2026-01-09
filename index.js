const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No message provided" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error with Gemini:", error);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

// Use Render's port or default to 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
