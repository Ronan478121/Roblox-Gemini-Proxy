const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Processing request for model: gemini-3-flash"); // Safety Log
        
        // Using the 2026 standard model
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
