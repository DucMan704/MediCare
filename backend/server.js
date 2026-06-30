import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import messageRouter from "./routes/messageRoute.js";

// =======================
// APP CONFIG
// =======================

const app = express();

const port = process.env.PORT || 4000;

// =======================
// DATABASE + CLOUDINARY
// =======================

connectDB();
connectCloudinary();

// =======================
// CORS CONFIG
// =======================

const allowedOrigins = [
  "http://localhost:5173",

  // User frontend
  "https://medi-care-ochre.vercel.app",

  // Admin frontend
  "https://medi-care-admin-tau.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép Postman, mobile app,
    // server gọi server không có Origin
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "atoken"],
};

// CORS phải đặt trước routes
app.use(cors(corsOptions));

// xử lý request OPTIONS (preflight)
app.options("*", cors(corsOptions));

// =======================
// MIDDLEWARE
// =======================

app.use(express.json());

// =======================
// ROUTES
// =======================

app.use("/api/user", userRouter);

app.use("/api/admin", adminRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/messages", messageRouter);

// =======================
// TEST API
// =======================

app.get("/", (req, res) => {
  res.send("API Working");
});

// =======================
// ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS blocked",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
  });
});

// =======================
// START SERVER
// =======================

app.listen(port, () => {
  console.log(`Server running on PORT:${port}`);
});
