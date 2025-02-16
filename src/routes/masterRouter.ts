import express from "express";
import authCheck from "../middlewares/authCheck";
import authRouter from "./authRouter";
import postRouter from "./postRouter";
import userRouter from "./userRouter";

const masterRouter = express.Router();

masterRouter.use("/auth", authRouter);
masterRouter.use("/post", authCheck, postRouter);
masterRouter.use("/user", authCheck, userRouter);

export default masterRouter;
