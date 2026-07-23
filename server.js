const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

app.post("/chat", (req, res) => {

    const { message } = req.body;

    res.json({
        reply: `Anim Core received: ${message}`
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Anim Core running on port ${PORT}`);
});
