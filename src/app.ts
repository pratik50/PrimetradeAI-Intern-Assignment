import express from "express";
import healthRouter from "./routes/health.route";
import authRouter from "./modules/auth/auth.route";

const app = express();

app.use(express.json());

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;
