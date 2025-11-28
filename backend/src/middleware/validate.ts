import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and strip unknown keys
      // replace req.body with the validated (clean) data
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc: any, curr) => {
          const key = curr.path[0] as string;
          acc[key] = curr.message;
          return acc;
        }, {});

        res.status(400).json({ success: false, errors });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }
  };
