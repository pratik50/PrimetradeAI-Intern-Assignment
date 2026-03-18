import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const requireRole = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
            });
            return;
        }

        next();
    };
};

export const requireSelfOrAdmin = (paramKey: string = "userId") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const resourceUserId = req.params[paramKey];

        if (!resourceUserId) {
            res.status(400).json({
                success: false,
                message: `Missing route parameter: ${paramKey}`,
            });
            return;
        }

        if (req.user.role === Role.ADMIN || req.user.id === resourceUserId) {
            next();
            return;
        }

        res.status(403).json({
            success: false,
            message: "Forbidden: you can access only your own resource",
        });
    };
};
