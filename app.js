console.log("APP FILE RUNNING");
import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import dbconnection from "./database/dbconnection.js";
import { errorMiddleware } from "./middlewares/error.js";

import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";
import TimeLineRoutes from "./router/TimeLineRoutes.js";
import SoftwareRoutes from "./router/softwareApplicationRoutes.js";
import SkillRoutes from "./router/skillsRoutes.js";
import ProjectRoutes from "./router/ProjectRoutes.js";

const app = express();

// ENV CONFIG
dotenv.config({path: "./config/config.env"});
dbconnection()

// ✅ CORS FIX (MOST IMPORTANT)
const allowedOrigins = [
  "https://dashboard-frontend-59sr.vercel.app",
  "https://divya-portfolio-orpin.vercel.app", 
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ COOKIE PARSER
app.use(cookieParser());

// ✅ FILE UPLOAD
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ✅ ROUTES
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", TimeLineRoutes);
app.use("/api/v1/softwareapplication", SoftwareRoutes);
app.use("/api/v1/skill", SkillRoutes);
app.use("/api/v1/project", ProjectRoutes);

// ✅ DATABASE


// ✅ ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;