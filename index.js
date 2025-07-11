const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const shortid = require('shortid');
const dotenv = require('dotenv');
const cors = require('cors');
const Url = require('./models/Url');

dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json()); 

// mongodb connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,
  message: {
    status: 429,
    error: "Too many requests. Please try again after 1 minute."
  }
});

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

app.post('/shorten', limiter, async (req, res) => {
  const { url, expiryMinutes } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const shortCode = shortid.generate();
    let expiryDate;
    if (expiryMinutes && !isNaN(expiryMinutes)) {
      expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000); 
    }

    const newEntry = new Url({
      originalUrl: url,
      shortCode,
      expiryDate: expiryDate || null
    });

    await newEntry.save();

    const shortUrl = `https://short.ly/${shortCode}`;
    res.json({ shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/:code', async (req, res) => {
  const { code } = req.params;
  console.log("Short code hit:", code);

  try {
    const urlEntry = await Url.findOne({ shortCode: code });

    if (urlEntry) {
      if (urlEntry.expiryDate && urlEntry.expiryDate < new Date()) {
        return res.status(410).json({ error: "Link has expired" });
      }

      urlEntry.clicks = (urlEntry.clicks || 0) + 1;
      await urlEntry.save();

      return res.redirect(urlEntry.originalUrl);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
