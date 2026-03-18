import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword, signAccessToken } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";

export const register = async (req: Request, res: Response): Promise<void> => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        res.status(409).json({
            success: false,
            message: "Email is already registered",
        });
        return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const token = signAccessToken({
        sub: user.id,
        role: user.role,
        email: user.email,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user,
            token,
        },
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        return;
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        return;
    }

    const token = signAccessToken({
        sub: user.id,
        role: user.role,
        email: user.email,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        },
    });
};

export const me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "User profile fetched",
        data: user,
    });
};
