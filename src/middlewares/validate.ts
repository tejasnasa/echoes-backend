import { Request, Response, NextFunction } from "express";
import { ServerResponse } from "../models/serverResponse";
import { z, ZodSchema } from "zod";

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = z.treeifyError(result.error);
      res
        .status(400)
        .json(new ServerResponse(false, "Validation failed", errors, 400));
      return;
    }

    next();
  };

export default validate;
