import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { createTaskSchema, updateTaskSchema } from "./task.validation";

const getTaskIdParam = (req: Request): string | null => {
    const { taskId } = req.params;
    return typeof taskId === "string" ? taskId : null;
};

const canAccessTask = (role: Role, userId: string, ownerId: string): boolean => {
    return role === Role.ADMIN || userId === ownerId;
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }

    const task = await prisma.task.create({
        data: {
            ...parsed.data,
            ownerId: req.user.id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
    });
};

export const listTasks = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const whereClause = req.user.role === Role.ADMIN ? {} : { ownerId: req.user.id };

    const tasks = await prisma.task.findMany({
        where: whereClause,
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: tasks,
    });
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const taskId = getTaskIdParam(req);

    if (!taskId) {
        res.status(400).json({ success: false, message: "Invalid task id" });
        return;
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!task) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
    }

    if (!canAccessTask(req.user.role, req.user.id, task.ownerId)) {
        res.status(403).json({
            success: false,
            message: "Forbidden: you can access only your own task",
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: "Task fetched successfully",
        data: task,
    });
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const taskId = getTaskIdParam(req);

    if (!taskId) {
        res.status(400).json({ success: false, message: "Invalid task id" });
        return;
    }

    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
            details: parsed.error.issues.map((issue) => issue.message),
        });
        return;
    }

    const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true, ownerId: true },
    });

    if (!existingTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
    }

    if (!canAccessTask(req.user.role, req.user.id, existingTask.ownerId)) {
        res.status(403).json({
            success: false,
            message: "Forbidden: you can update only your own task",
        });
        return;
    }

    const task = await prisma.task.update({
        where: { id: taskId },
        data: parsed.data,
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
    });
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const taskId = getTaskIdParam(req);

    if (!taskId) {
        res.status(400).json({ success: false, message: "Invalid task id" });
        return;
    }

    const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true, ownerId: true },
    });

    if (!existingTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
    }

    if (!canAccessTask(req.user.role, req.user.id, existingTask.ownerId)) {
        res.status(403).json({
            success: false,
            message: "Forbidden: you can delete only your own task",
        });
        return;
    }

    await prisma.task.delete({
        where: { id: taskId },
    });

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
};
