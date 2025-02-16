import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import "dotenv/config";
import masterRouter from "./routes/masterRouter";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));
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
