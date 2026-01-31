import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);

export default app;
