import type { Request, Response, NextFunction } from "express";
import { toLowerCaseKeys } from "../utils/transformKeys.js";

export function lowercaseResponseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    if (body && typeof body === "object") {
      body = toLowerCaseKeys(body);
    }

    return originalJson(body);
  };

  next();
}