import express, { Request, Response } from "express";
import { editPassword, editProfile, whoAmI } from "../controllers/self";

const selfRouter = express.Router();

selfRouter.get("/whoami", async (req: Request, res: Response) => {
  const { userId } = req.body.token;

  const response = await whoAmI(userId);

  res.status(response.statusCode).json(response);
});

selfRouter.put("/password", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { oldPassword, newPassword1, newPassword2 } = req.body;

  const response = await editPassword(
    userId,
    oldPassword,
    newPassword1,
    newPassword2
  );

  res.status(response.statusCode).json(response);
});

selfRouter.put("/edit", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const data = req.body;

  const response = await editProfile(data, userId);

  res.status(response.statusCode).json(response);
});

export default selfRouter;
