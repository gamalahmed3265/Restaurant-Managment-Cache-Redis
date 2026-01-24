import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation Error",
        error: result.error.format(),
      });
    }

    req.body = result.data as T; // strongly recommended
    next();
  };
};
