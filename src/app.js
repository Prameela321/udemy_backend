import express, { urlencoded } from "express";
import cors from "cors";
import healthCheckRoutes from "./routes/healthcheck.routes.js";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.ORIGINS?.split(",") || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["POST", "GET", "PATCH", "PUT", "DELETE"],
  })
);

app.use("/api/v1/healthcheck", healthCheckRoutes);
export default app;
