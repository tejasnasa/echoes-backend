import express, { Request } from "express";
import { signup } from "../controllers/auth";
import { ServerResponse } from "../models/clientResponse";

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: ServerResponse) => {
  const { data } = req.body;

  const response = await signup(data);

  return res.status(response.statusCode).json(response);
});

export default authRouter;
