import express, { Request, Response } from "express";
import { editPassword, editProfile, whoAmI } from "../controllers/self";

const selfRouter = express.Router();

selfRouter.get("/whoami", async (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const response = await whoAmI(userId);

  res.status(response.statusCode).json(response);
});

selfRouter.patch("/password", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { newPassword } = req.body;

  const response = await editPassword(userId, newPassword);

  res.status(response.statusCode).json(response);
});

selfRouter.patch("/edit", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const data = req.body;

  const response = await editProfile(data, userId);

  res.status(response.statusCode).json(response);
});

export default selfRouter;
