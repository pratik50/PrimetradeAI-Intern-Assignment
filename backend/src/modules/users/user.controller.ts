import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const updateRoleSchema = z.object({
    role: z.enum(Role),
});

const getUserIdParam = (req: Request): string | null => {
    const { userId } = req.params;
    return typeof userId === "string" ? userId : null;
};

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserIdParam(req);

    if (!userId) {
        res.status(400).json({
            success: false,
            message: "Invalid user id",
        });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
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
        message: "User fetched successfully",
        data: user,
    });
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const parsed = updateRoleSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    const userId = getUserIdParam(req);

    if (!userId) {
        res.status(400).json({
            success: false,
            message: "Invalid user id",
        });
        return;
    }

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!existingUser) {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            role: parsed.data.role,
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

    res.status(200).json({
        success: true,
        message: "User role updated",
        data: user,
    });
};
