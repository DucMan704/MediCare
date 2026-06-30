import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import messageRouter from "./routes/messageRoute.js";

const app = express();

const port = process.env.PORT || 4000;

// =======================
// Connect Database
// =======================
connectDB();

// =======================
// Connect Cloudinary
// =======================
connectCloudinary();

// =======================
// CORS CONFIG
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://medi-care-ochre.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin
      // (Postman, server-to-server)
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

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// xử lý preflight request
app.options("*", cors());

// =======================
// BODY PARSER
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
// START SERVER
// =======================

app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
});
