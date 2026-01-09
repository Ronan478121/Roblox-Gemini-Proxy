const express = require('express');
// We are now using the NEW 2026 SDK
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

// Initialize the new client
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/ask', async (req, res) => {
    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Change: Ensure we wait for the result properly
        const result = await model.generateContent(message);
        const response = await result.response; // Now 'response' is defined!
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});
        
        // 2026 Stable Model Name
       // Replace your model line with this:
const model = client.models.generateContent({
    model: 'gemini-2.5-flash',
    systemInstruction: "You are an expert Roblox Luau scripter. Always use task.wait() instead of wait(). Use GetService. Provide code in Markdown blocks.",
    contents: [{ role: 'user', parts: [{ text: message }] }]
});

        res.json({ reply: response.text });
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
