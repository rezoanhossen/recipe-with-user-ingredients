// server/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/clarifai", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer.toString("base64");

    const response = await fetch("https://api.clarifai.com/v2/models/food-item-v1.0/outputs", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.CLARIFAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                base64: imageBuffer,
              },
            },
          },
        ],
      }),
    });

    const data = await response.json();
    const concept = data.outputs?.[0]?.data?.concepts?.[0]?.name;

    res.json({ concept });
  } catch (error) {
    console.error("Clarifai error:", error);
    res.status(500).json({ error: "Clarifai API call failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
