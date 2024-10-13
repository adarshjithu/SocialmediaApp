"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCatch = void 0;
const errorCatch = (req, res, next) => {
    console.log(res.statusCode);
    next();
};
exports.errorCatch = errorCatch;
