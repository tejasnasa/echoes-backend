import express, { Request, Response } from "express";
import { whoAmI } from "../controllers/self";

const selfRouter = express.Router();

selfRouter.get("/whoami", async (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const response = await whoAmI(userId);

  res.status(response.statusCode).json(response);
});

export default selfRouter;
