import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "./authMiddleware.js";

dotenv.config();

const app = express();
const PORT = 4002;

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory storage (production'da database kullan)
let capsules = [];

// Functions to save and load capsules from file
const saveCapsules = () => {
  try {
    fs.writeFileSync('capsules.json', JSON.stringify(capsules, null, 2));
  } catch (err) {
    console.error('Error saving capsules:', err);
  }
};

const loadCapsules = () => {
  try {
    if (fs.existsSync('capsules.json')) {
      const data = fs.readFileSync('capsules.json', 'utf8');
      capsules = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading capsules:', err);
  }
};

// TEST
app.get("/", (req, res) => {
  res.send("Memora backend is running 🚀");
});

// LOGIN
app.post("/login", (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Adres yok" });
    }

    const token = jwt.sign(
      { address },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CAPSULES
app.get("/capsules", authMiddleware, (req, res) => {
  const userCapsules = capsules.filter(c => c.address === req.user.address);
  res.json(userCapsules);
});

app.get("/capsules/count", authMiddleware, (req, res) => {
  const userCapsules = capsules.filter(c => c.address === req.user.address);
  res.json({ count: userCapsules.length });
});

app.get("/capsules/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const capsule = capsules.find(c => c.id === id && c.address === req.user.address);

  if (!capsule) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  res.json(capsule);
});

app.post("/capsules", authMiddleware, upload.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), (req, res) => {
  const { text, unlockDate } = req.body;

  if (!text || !unlockDate) {
    return res.status(400).json({ error: "Text ve unlockDate gerekli" });
  }

  const photos = req.files.photos ? req.files.photos.map(file => file.filename) : [];
  const videos = req.files.videos ? req.files.videos.map(file => file.filename) : [];

  const newCapsule = {
    id: Date.now(),
    text,
    unlockDate,
    photos,
    videos,
    address: req.user.address,
    createdAt: new Date().toISOString()
  };

  capsules.push(newCapsule);
  saveCapsules();
  res.json({ success: true, capsule: newCapsule });
});

app.delete("/capsules/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = capsules.findIndex(c => c.id === id && c.address === req.user.address);

  if (index === -1) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  capsules.splice(index, 1);
  saveCapsules();
  res.json({ success: true });
});

loadCapsules();

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
