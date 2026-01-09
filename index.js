const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: "No message provided" });
    }

    try {
        // FIX: Using "gemini-pro" is the most stable way to call the model 
        // if "gemini-1.5-flash" is throwing 404s on your current SDK version
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error with Gemini:", error);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
