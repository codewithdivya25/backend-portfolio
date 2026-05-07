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
dotenv.config({ path: "./config/config.env" });

// ✅ CORS FIX (MOST IMPORTANT)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
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
dbconnection();

// ✅ ERROR MIDDLEWARE
app.use(errorMiddleware);

export default app;