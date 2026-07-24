const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "online",
        name: "Anim Core",
        version: "1.0.0"
    });
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Something went wrong while talking to Gemini."
        });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Anim Core running on port ${PORT}`);
});
