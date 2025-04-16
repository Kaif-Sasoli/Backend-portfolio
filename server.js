import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/connection.js";

import userRouter from "./routes/userRouter.js";
import educationRouter from "./routes/educationRouter.js";
import experienceRouter from "./routes/experienceRouter.js";
import courseRouter from "./routes/courseRouter.js";
import expertiseRoutes from "./routes/expertiseRoutes.js";
import projectsRoutes from "./routes/projectRoutes.js";
import messageRouter from "./routes/messageRouter.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://dev-khadim.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/education", educationRouter);
app.use("/api/v1/experience", experienceRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/expertise", expertiseRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/messages", messageRouter);

// Connect to the database
await dbConnection();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend Portfolio Server is running...");
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

export default app;
