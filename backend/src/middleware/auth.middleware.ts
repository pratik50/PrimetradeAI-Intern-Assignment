import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { TokenPayload } from "../modules/auth/auth.service";
import { env } from "../config/env";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Authentication token is missing",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;

        req.user = {
            id: decoded.sub,
            role: decoded.role,
            email: decoded.email,
        };

        next();
    } catch {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
