import express, { urlencoded } from "express";
import cors from "cors";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

console.log(process.env.ORIGINS, "orgiinds");
app.use(
  cors({
    origin: process.env.ORIGINS?.split(",") || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  }),
);

app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
  });
});

export default app;
