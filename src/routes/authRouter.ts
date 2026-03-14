import express, { Request, Response } from "express";
import { login, signup } from "../controllers/auth";
import validate from "../middlewares/validate";
import { signupSchema } from "../models/validations";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validate(signupSchema),
  async (req: Request, res: Response) => {
    const { username, fullname, email, password } = req.body;

    const response = await signup({ username, fullname, email, password });

    if (!response.success) {
      res.status(response.statusCode).json(response);
      return;
    }

    res
      .status(response.statusCode)
      .cookie("session", response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .json(response);
    return;
  },
);

authRouter.post("/login", async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  const response = await login({ emailOrUsername, password });

  if (!response.success) {
    res.status(response.statusCode).json(response);
    return;
  }

  res
    .status(response.statusCode)
    .cookie("session", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json(response);
  return;
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  // res.clearCookie("session", {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: true,
  // });
  res
    .status(200)
    .clearCookie("session", {
      httpOnly: true,
      secure: true,
      sameSite: true,
    })
    .json({ success: true, message: "Logged out successfully" });
});

export default authRouter;
