const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

// Initialize with the key from Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No prompt provided." });

    try {
        // We use 'gemini-1.5-pro' - it's the most widely supported model across all regions
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("--- DETAILED ERROR LOG ---");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        if (error.status) console.error("Status:", error.status);
        
        // This will send the EXACT error name back to Roblox
        res.status(500).json({ 
            reply: "GOOGLE ERROR: " + error.message + " (Check if API Key is valid in AI Studio)" 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Server is online`);
});
