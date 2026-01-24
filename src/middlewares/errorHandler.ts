import type { Request, Response,NextFunction } from "express";
import { errorResponse } from "@/utils/responses.js";
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${message}`);
   errorResponse(res,message,statusCode,err.stack);
}