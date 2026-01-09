const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;
        
        // System Prompt: Tells the AI to behave like a Roblox expert
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a Roblox Studio Luau expert. Provide only functional code or brief instructions. Avoid long explanations unless asked."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Send the AI response back to Roblox
        res.json({ reply: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "Error: Could not reach the AI." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
