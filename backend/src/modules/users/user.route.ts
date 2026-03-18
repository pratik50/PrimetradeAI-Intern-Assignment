import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole, requireSelfOrAdmin } from "../../middleware/authorization.middleware";
import { getUserById, listUsers, updateUserRole } from "./user.controller";

const userRouter = Router();

userRouter.get("/", requireAuth, requireRole("ADMIN"), listUsers);
userRouter.get("/:userId", requireAuth, requireSelfOrAdmin("userId"), getUserById);
userRouter.patch("/:userId/role", requireAuth, requireRole("ADMIN"), updateUserRole);

export default userRouter;
