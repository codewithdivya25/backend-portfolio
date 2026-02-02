import express  from "express"
import dotenv  from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbconnection from "./database/dbconnection.js";
import {errorMiddleware} from "./middlewares/error.js";
import messageRouter  from "./router/messageRoutes.js"
import userRouter from "./router/userRoutes.js"
import TimeLineRoutes from "./router/TimeLineRoutes.js"
import  SoftwareRoutes from "./router/softwareApplicationRoutes.js";
import SkillRoutes from "./router/skillsRoutes.js"
import ProjectRoutes from "./router/ProjectRoutes.js"
const app = express();
dotenv.config({path:"./config/config.env"})
app.use(cors({
 origin:[process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
 methods:["GET","POST","PUT","DELETE"] ,
 credentials: true,

}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true }))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp",
}))

app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)
 app.use("/api/v1/timeline", TimeLineRoutes);
app.use("/api/v1/softwareappliaction", SoftwareRoutes)
app.use("/api/v1/skill", SkillRoutes) 
app.use("/api/v1/project", ProjectRoutes) 
dbconnection()
app.use(errorMiddleware)


export default app;