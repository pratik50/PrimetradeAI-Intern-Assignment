import { TaskStatus } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(150, "Title is too long"),
    description: z.string().trim().max(1000, "Description is too long").optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});

export const updateTaskSchema = z
    .object({
        title: z.string().trim().min(1, "Title is required").max(150, "Title is too long").optional(),
        description: z.string().trim().max(1000, "Description is too long").optional(),
        status: z.nativeEnum(TaskStatus).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
        message: "At least one field must be provided",
    });
