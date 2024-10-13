"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Configure your Cloudinary credentials
cloudinary_1.v2.config({
    cloud_name: `dkx0oifia`,
    api_key: `313292679688857`,
    api_secret: `83cRXGKvXbeaWWUqH0kVY2RTv3c`,
});
exports.default = cloudinary_1.v2;
