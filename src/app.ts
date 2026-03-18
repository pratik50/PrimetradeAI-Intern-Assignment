import express from "express";
import healthRouter from "./routes/health.route";
import docsRouter from "./routes/docs.route";
import authRouter from "./modules/auth/auth.route";
import userRouter from "./modules/users/user.route";
import taskRouter from "./modules/tasks/task.route";

const app = express();

app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api", docsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;
