import express, { Application } from "express";
import "./clearLog";
import cors from "cors";
import userRouter from "./Routes/userRoutes";
import adminRouter from "./Routes/adminRoutes";

import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import errorHandler from "./Middleware/errorHandeler";
import postRouter from "./Routes/postRoutes";
import http from "http"; // Import http module
import MongoStore from "connect-mongo";
import path from "path";
import dotenv from 'dotenv'
dotenv.config();
import { createSocketConnectionForChat } from "./Config/Chat";
import chatRouter from "./Routes/chatRoutes";

const app: Application = express();

//Create an HTTP server
const server = http.createServer(app);

const io = createSocketConnectionForChat(server)
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb+srv://adarshjithu10:gnRFd0XoU2bJGXko@cluster0.xhehb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', // This must be set properly
        ttl: 14 * 24 * 60 * 60, // Session expires in 14 days
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    })
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/post", postRouter);
app.use("/chat",chatRouter)

// Global error handler
app.use(errorHandler);

// Export the server for use in index.ts
export { server,io };
