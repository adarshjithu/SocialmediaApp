"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app"); // Import the server
const db_1 = __importDefault(require("./Config/db"));
const path = require("path");
dotenv_1.default.config({ path: path.join(__dirname, '../.env') });
(0, db_1.default)();
app_1.server.listen(3000, () => {
    console.log('Server started on port 3000');
});
