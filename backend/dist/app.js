"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express"));
require("./clearLog");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandeler_1 = __importDefault(require("./Middleware/errorHandeler"));
const postRoutes_1 = __importDefault(require("./Routes/postRoutes"));
const http_1 = __importDefault(require("http")); // Import http module
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Chat_1 = require("./Config/Chat");
const chatRoutes_1 = __importDefault(require("./Routes/chatRoutes"));
const app = (0, express_1.default)();
//Create an HTTP server
const server = http_1.default.createServer(app);
exports.server = server;
const io = (0, Chat_1.createSocketConnectionForChat)(server);
exports.io = io;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", 'https://socialmedia-app-6zt7.vercel.app/'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Route handlers
app.use("/", userRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/post", postRoutes_1.default);
app.use("/chat", chatRoutes_1.default);
// Global error handler
app.use(errorHandeler_1.default);
