import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Define the path to the log file
const logFilePath = path.join(__dirname, '../error.log');

export function logErrors(req: Request, res: Response, next: NextFunction): void {
  // Store the original `res.send` method
  const originalSend = res.send;

  // Override `res.send` to capture and log error responses
  res.send = function (this: Response<any, Record<string, any>>, body: any): Response<any, Record<string, any>> {
    // Check if the response status code indicates an error
    if (res.statusCode >= 400) {
      // Create a log message with request and response details
      const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${body}\n`;
      // Append the log message to the log file
      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error('Failed to write to log file:', err);
      });
    }
    // Call the original `res.send` method
    return originalSend.call(this, body);
  } as unknown as typeof res.send; // Ensure the correct type is used

  // Proceed to the next middleware
  next();
}
