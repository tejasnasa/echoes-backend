import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import "dotenv/config";
import masterRouter from "./routes/masterRouter";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies (important for session handling)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/v1", masterRouter);

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
