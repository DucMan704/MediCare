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


// ===============================
// CONNECT DATABASE + CLOUDINARY
// ===============================

connectDB();
connectCloudinary();



// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [

    // Local development
    "http://localhost:5173",

    // User frontend
    "https://medi-care-ochre.vercel.app",

    // Admin frontend
    "https://medi-care-admin-tau.vercel.app"
];


const corsOptions = {

    origin: (origin, callback) => {


        // Cho phép request không có origin
        // Ví dụ: Postman, server request
        if (!origin) {
            return callback(null, true);
        }


        if (allowedOrigins.includes(origin)) {

            return callback(null, true);

        }


        return callback(
            new Error("Not allowed by CORS")
        );
    },


    credentials: true,


    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],


    allowedHeaders: [

        // JSON request
        "Content-Type",

        // JWT chuẩn (nếu dùng)
        "Authorization",

        // Admin token
        "atoken",

        // Doctor token
        "dtoken"
    ]
};


// CORS phải đặt trước routes
app.use(cors(corsOptions));


// Xử lý preflight request
app.options("*", cors(corsOptions));



// ===============================
// BODY PARSER
// ===============================

app.use(express.json());



// ===============================
// API ROUTES
// ===============================

app.use("/api/user", userRouter);

app.use("/api/admin", adminRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/messages", messageRouter);



// ===============================
// TEST API
// ===============================

app.get("/", (req, res) => {

    res.status(200).send(
        "API Working"
    );

});



// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {


    console.error(
        "SERVER ERROR:",
        err.message
    );


    if (err.message === "Not allowed by CORS") {

        return res.status(403).json({

            success: false,

            message: "CORS blocked"

        });

    }



    res.status(500).json({

        success:false,

        message:"Internal Server Error"

    });

});



// ===============================
// START SERVER
// ===============================

app.listen(port, () => {

    console.log(
        `Server running on PORT:${port}`
    );

});