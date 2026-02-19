import "../config/load-env";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { env } from "node:process";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET nÃ£o configurado" });
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      userId: number;
    };

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}
