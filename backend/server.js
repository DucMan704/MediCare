import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import messageRouter from "./routes/messageRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 4000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// ===== Tự động khởi động ml-service (Python) =====
const mlServicePath = path.join(__dirname, "ml-service");
const pythonPath = path.join(mlServicePath, "venv", "Scripts", "python.exe"); // Windows
// const pythonPath = path.join(mlServicePath, "venv", "bin", "python"); // macOS/Linux

console.log("Starting ML service...");

const mlProcess = spawn(pythonPath, ["app.py"], {
  cwd: mlServicePath,
});

mlProcess.stdout.on("data", (data) => {
  console.log(`[ML Service] ${data}`.trim());
});

mlProcess.stderr.on("data", (data) => {
  console.error(`[ML Service Error] ${data}`.trim());
});

mlProcess.on("close", (code) => {
  console.log(`ML service exited with code ${code}`);
});

process.on("SIGINT", () => {
  mlProcess.kill();
  process.exit();
});

process.on("exit", () => {
  mlProcess.kill();
});

// ===== Chờ ml-service sẵn sàng =====
const waitForMLService = async (retries = 20) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fetch(`${ML_SERVICE_URL}/`);
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return false;
};

// api endpoints (giữ nguyên)
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api", messageRouter);

// ===== Diagnosis endpoints (gọi sang ml-service) =====

// DIABETES - tabular JSON
app.post("/api/diagnosis/diabetes", async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/diabetes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "ML service unavailable" });
  }
});

// MALARIA - ảnh (multipart)
app.post("/api/diagnosis/malaria", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch(`${ML_SERVICE_URL}/predict/malaria`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "ML service unavailable" });
  }
});

// PNEUMONIA - ảnh (multipart)
app.post(
  "/api/diagnosis/pneumonia",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const formData = new FormData();
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await fetch(`${ML_SERVICE_URL}/predict/pneumonia`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) return res.status(response.status).json(data);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "ML service unavailable" });
    }
  },
);

// STROKE - tabular JSON
app.post("/api/diagnosis/stroke", async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/stroke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "ML service unavailable" });
  }
});

app.get("/", (req, res) => {
  res.send("API Working");
});

// ===== Khởi động Node server sau khi ml-service sẵn sàng =====
waitForMLService().then((ready) => {
  if (!ready) {
    console.error("ML service did not start in time. Check ml-service logs.");
  }
  app.listen(port, () => console.log(`Server started on PORT:${port}`));
});
