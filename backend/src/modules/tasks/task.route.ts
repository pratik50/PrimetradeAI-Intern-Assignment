import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { createTask, deleteTask, getTaskById, listTasks, updateTask } from "./task.controller";

const taskRouter = Router();

taskRouter.post("/", requireAuth, createTask);
taskRouter.get("/", requireAuth, listTasks);
taskRouter.get("/:taskId", requireAuth, getTaskById);
taskRouter.patch("/:taskId", requireAuth, updateTask);
taskRouter.delete("/:taskId", requireAuth, deleteTask);

export default taskRouter;
