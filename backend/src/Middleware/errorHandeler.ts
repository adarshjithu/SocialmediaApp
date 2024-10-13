// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import logger from "../logger";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // Log the error details
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        body: req.body,
    });

    // Send response to the client
    res.status(res.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}

export default errorHandler;
